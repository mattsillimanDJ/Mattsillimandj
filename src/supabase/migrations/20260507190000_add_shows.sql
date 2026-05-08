CREATE TYPE show_status AS ENUM ('upcoming', 'past');

CREATE TABLE shows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date TIMESTAMPTZ NOT NULL,
  venue TEXT NOT NULL,
  city TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'USA',
  lineup TEXT,
  "ticketUrl" TEXT,
  status show_status NOT NULL DEFAULT 'upcoming',
  featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX shows_status_date_idx ON shows (status, date);
CREATE INDEX shows_featured_date_idx ON shows (featured, date);

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER shows_set_updated_at
BEFORE UPDATE ON shows
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();
