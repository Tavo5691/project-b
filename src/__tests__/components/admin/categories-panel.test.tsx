import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'

const createCategoryMock = vi.fn()
const renameCategoryMock = vi.fn()
const deleteCategoryMock = vi.fn()
vi.mock('@/actions/admin/categories', () => ({
  createCategory: (...args: unknown[]) => createCategoryMock(...args),
  renameCategory: (...args: unknown[]) => renameCategoryMock(...args),
  deleteCategory: (...args: unknown[]) => deleteCategoryMock(...args),
}))

import { CategoriesPanel } from '@/components/admin/categories-panel'
import type { Category } from '@/types/database'

const categories: Category[] = [
  { id: 'cat-1', name: 'Cocina', created_at: '' },
  { id: 'cat-2', name: 'Bebé', created_at: '' },
]

describe('CategoriesPanel', () => {
  beforeEach(() => {
    createCategoryMock.mockReset()
    renameCategoryMock.mockReset()
    deleteCategoryMock.mockReset()
  })

  it('lists all categories', () => {
    render(<CategoriesPanel categories={categories} />)
    expect(screen.getByText('Cocina')).toBeInTheDocument()
    expect(screen.getByText('Bebé')).toBeInTheDocument()
  })

  it('adds a new category via the inline add form', async () => {
    createCategoryMock.mockResolvedValueOnce({ success: true })
    render(<CategoriesPanel categories={categories} />)

    fireEvent.change(screen.getByLabelText('Nueva categoría'), {
      target: { value: 'Baño' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Agregar' }))

    await waitFor(() => {
      expect(createCategoryMock).toHaveBeenCalled()
    })
  })

  it('shows an error when deleting a category that still has gifts', async () => {
    deleteCategoryMock.mockResolvedValueOnce({ success: false, error: 'has_gifts' })
    render(<CategoriesPanel categories={categories} />)

    fireEvent.click(screen.getAllByRole('button', { name: 'Eliminar' })[0])

    await waitFor(() => {
      expect(
        screen.getByText('No se puede eliminar: hay regalos asignados a esta categoría.')
      ).toBeInTheDocument()
    })
    expect(screen.getByText('Cocina')).toBeInTheDocument()
  })

  it('renames a category via the inline edit control', async () => {
    renameCategoryMock.mockResolvedValueOnce({ success: true })
    render(<CategoriesPanel categories={categories} />)

    fireEvent.click(screen.getAllByRole('button', { name: 'Editar' })[0])
    const input = screen.getByDisplayValue('Cocina')
    fireEvent.change(input, { target: { value: 'Cocina y Comedor' } })
    fireEvent.click(screen.getByRole('button', { name: 'Guardar' }))

    await waitFor(() => {
      expect(renameCategoryMock).toHaveBeenCalled()
    })
  })

  it('removes the category from view after a successful delete', async () => {
    deleteCategoryMock.mockResolvedValueOnce({ success: true })
    render(<CategoriesPanel categories={categories} />)

    fireEvent.click(screen.getAllByRole('button', { name: 'Eliminar' })[0])

    await waitFor(() => {
      expect(screen.queryByText('Cocina')).not.toBeInTheDocument()
    })
  })
})
