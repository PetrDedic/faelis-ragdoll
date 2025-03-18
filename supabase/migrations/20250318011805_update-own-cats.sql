-- Přidání sloupce pro označení vlastní chovné kočky
ALTER TABLE cats ADD COLUMN is_own_breeding_cat BOOLEAN NOT NULL DEFAULT FALSE;

-- Přidání komentáře k sloupci
COMMENT ON COLUMN cats.is_own_breeding_cat IS 'Označuje, zda je kočka moje vlastní chovná kočka';

-- Vytvoření indexu pro rychlejší filtrování
CREATE INDEX idx_cats_is_own_breeding_cat ON cats(is_own_breeding_cat);