CREATE SEQUENCE title_deed_application_no_seq START 1000 INCREMENT 1;
CREATE OR REPLACE FUNCTION title_deed_application_no_function() RETURNS trigger AS $$
DECLARE
  branch_code TEXT;
BEGIN
  -- Fetch branch prefix directly using NEW.branch_id
  SELECT code INTO branch_code
  FROM branches
  WHERE id = NEW.branch_id;

  NEW.application_no := branch_code || '-' || LPAD(nextval('title_deed_application_no_seq')::text, 9, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER title_deed_application_no_trigger
BEFORE INSERT ON title_deed_applications
FOR EACH ROW
EXECUTE FUNCTION title_deed_application_no_function();