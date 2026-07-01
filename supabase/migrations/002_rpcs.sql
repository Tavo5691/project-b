-- reserve_gift: atomic reserve — UPDATE gift + INSERT reservation
CREATE OR REPLACE FUNCTION reserve_gift(
  p_gift_id      UUID,
  p_first_name   TEXT,
  p_last_name    TEXT,
  p_message      TEXT,
  p_cancel_token TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_rows INTEGER;
BEGIN
  UPDATE gifts SET status = 'reserved'
  WHERE id = p_gift_id AND status = 'available';
  GET DIAGNOSTICS v_rows = ROW_COUNT;
  IF v_rows = 0 THEN
    RETURN jsonb_build_object('success', false, 'error', 'already_reserved');
  END IF;
  INSERT INTO reservations (gift_id, first_name, last_name, message, cancel_token)
  VALUES (p_gift_id, p_first_name, p_last_name, p_message, p_cancel_token);
  RETURN jsonb_build_object('success', true, 'cancel_token', p_cancel_token);
END;
$$;

-- cancel_reservation: cancel by TEXT cancel_token (e.g. 'ROSA-4821')
CREATE OR REPLACE FUNCTION cancel_reservation(
  p_cancel_token TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_reservation reservations%ROWTYPE;
  v_gift_name   TEXT;
BEGIN
  SELECT r.*, g.name INTO v_reservation, v_gift_name
  FROM reservations r
  JOIN gifts g ON g.id = r.gift_id
  WHERE r.cancel_token = p_cancel_token;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'not_found');
  END IF;
  DELETE FROM reservations WHERE id = v_reservation.id;
  UPDATE gifts SET status = 'available' WHERE id = v_reservation.gift_id;
  RETURN jsonb_build_object(
    'success', true,
    'gift_name', v_gift_name,
    'first_name', v_reservation.first_name,
    'last_name', v_reservation.last_name
  );
END;
$$;

-- cancel_reservation_admin: cancel by reservation UUID (admin use)
CREATE OR REPLACE FUNCTION cancel_reservation_admin(
  p_reservation_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_reservation reservations%ROWTYPE;
BEGIN
  SELECT * INTO v_reservation FROM reservations WHERE id = p_reservation_id;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'not_found');
  END IF;
  DELETE FROM reservations WHERE id = p_reservation_id;
  UPDATE gifts SET status = 'available' WHERE id = v_reservation.gift_id;
  RETURN jsonb_build_object('success', true);
END;
$$;
