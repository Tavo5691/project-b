import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { PhotoGallery } from '@/components/public/photo-gallery'

describe('PhotoGallery', () => {
  it('renders nothing when urls is an empty array', () => {
    const { container } = render(<PhotoGallery urls={[]} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('renders one image per URL, in array order', () => {
    const urls = ['https://example.com/1.jpg', 'https://example.com/2.jpg', 'https://example.com/3.jpg']
    render(<PhotoGallery urls={urls} />)
    const images = screen.getAllByRole('img')
    expect(images).toHaveLength(3)
    expect(images.map((img) => img.getAttribute('alt'))).toEqual([
      'Foto 1',
      'Foto 2',
      'Foto 3',
    ])
  })

  it('falls back to the placeholder image when one URL fails to load, others unaffected', () => {
    const urls = ['https://example.com/broken.jpg', 'https://example.com/ok.jpg']
    render(<PhotoGallery urls={urls} />)
    const images = screen.getAllByRole('img')

    fireEvent.error(images[0])

    expect(images[0]).toHaveAttribute('src', expect.stringContaining('gift-placeholder.svg'))
    expect(images[1]).not.toHaveAttribute('src', expect.stringContaining('gift-placeholder.svg'))
  })
})
