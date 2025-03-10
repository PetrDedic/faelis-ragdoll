-- Table: cats (Main table for all cats)
CREATE TABLE cats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    birth_date DATE,
    gender TEXT CHECK (gender IN ('male', 'female')),
    chip_number TEXT,
    registration_number TEXT,
    mother_id UUID REFERENCES cats(id),
    father_id UUID REFERENCES cats(id),
    description TEXT,
    details TEXT, -- Added field for additional information
    is_breeding BOOLEAN DEFAULT false,
    is_neutered BOOLEAN DEFAULT false,
    status TEXT CHECK (status IN ('alive', 'deceased', 'sold', 'reserved')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Indexes for the cats table
CREATE INDEX idx_cats_mother_id ON cats(mother_id);
CREATE INDEX idx_cats_father_id ON cats(father_id);

-- Table: colors (Ragdoll color information)
CREATE TABLE colors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name_cs TEXT NOT NULL, -- Czech name
    name_en TEXT NOT NULL, -- English name
    name_de TEXT NOT NULL, -- German name
    code TEXT NOT NULL,
    genetic_code TEXT,
    description_cs TEXT, -- Czech description
    description_en TEXT, -- English description
    description_de TEXT, -- German description
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table: varieties (Ragdoll pattern/variety information)
CREATE TABLE varieties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name_cs TEXT NOT NULL, -- Czech name
    name_en TEXT NOT NULL, -- English name
    name_de TEXT NOT NULL, -- German name
    code TEXT NOT NULL,
    genetic_code TEXT,
    description_cs TEXT, -- Czech description
    description_en TEXT, -- English description
    description_de TEXT, -- German description
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table: blood_types (Blood type information)
CREATE TABLE blood_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type TEXT NOT NULL CHECK (type IN ('A', 'B', 'AB')),
    genetic_code TEXT NOT NULL,
    is_carrier BOOLEAN DEFAULT false,
    description_cs TEXT, -- Czech description
    description_en TEXT, -- English description
    description_de TEXT, -- German description
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Junction table: cat_colors (Many-to-many relationship between cats and colors)
CREATE TABLE cat_colors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cat_id UUID REFERENCES cats(id) ON DELETE CASCADE,
    color_id UUID REFERENCES colors(id) ON DELETE CASCADE,
    is_phenotype BOOLEAN DEFAULT true, -- visual appearance
    is_genotype BOOLEAN DEFAULT false, -- genetic testing confirmed
    test_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(cat_id, color_id)
);

-- Junction table: cat_varieties (Many-to-many relationship between cats and varieties)
CREATE TABLE cat_varieties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cat_id UUID REFERENCES cats(id) ON DELETE CASCADE,
    variety_id UUID REFERENCES varieties(id) ON DELETE CASCADE,
    is_phenotype BOOLEAN DEFAULT true, -- visual appearance
    is_genotype BOOLEAN DEFAULT false, -- genetic testing confirmed
    test_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(cat_id, variety_id)
);

-- Junction table: cat_blood_types (Many-to-many relationship between cats and blood types)
CREATE TABLE cat_blood_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cat_id UUID REFERENCES cats(id) ON DELETE CASCADE,
    blood_type_id UUID REFERENCES blood_types(id) ON DELETE CASCADE,
    test_date DATE,
    test_method TEXT CHECK (test_method IN ('serological', 'genetic', 'puppy_test')),
    test_result TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(cat_id)
);

-- Table: litters (Information about cat litters)
CREATE TABLE litters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mother_id UUID REFERENCES cats(id) NOT NULL,
    father_id UUID REFERENCES cats(id) NOT NULL,
    birth_date DATE NOT NULL,
    number_of_kittens INTEGER,
    number_of_males INTEGER,
    number_of_females INTEGER,
    description TEXT,
    details TEXT, -- Added field for additional information
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table: cat_litters (Junction table to associate kittens with their litter)
CREATE TABLE cat_litters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cat_id UUID REFERENCES cats(id) ON DELETE CASCADE,
    litter_id UUID REFERENCES litters(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(cat_id, litter_id)
);

-- Table: genetic_tests (Genetic test results for cats)
CREATE TABLE genetic_tests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cat_id UUID REFERENCES cats(id) ON DELETE CASCADE,
    test_date DATE NOT NULL,
    test_type TEXT CHECK (test_type IN ('color', 'blood_type', 'health', 'other')),
    test_name TEXT NOT NULL,
    result TEXT NOT NULL,
    laboratory TEXT,
    certificate_number TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table: images (Store images of cats)
CREATE TABLE images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cat_id UUID REFERENCES cats(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    title TEXT,
    description TEXT,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Sample data for colors with multilingual support
INSERT INTO colors (name_cs, name_en, name_de, code, genetic_code, description_cs, description_en, description_de) VALUES
('Seal', 'Seal', 'Seal', 'n', 'BBDD/BBDd/BbDD/BbDd', 'Černohnědá barva', 'Seal brown color', 'Seal-braune Farbe'),
('Blue', 'Blue', 'Blau', 'a', 'BBdd/Bbdd', 'Modrá barva', 'Blue color', 'Blaue Farbe'),
('Chocolate', 'Chocolate', 'Schokolade', 'b', 'bbDD/bbDd', 'Čokoládová barva', 'Chocolate color', 'Schokoladenfarbe'),
('Lilac', 'Lilac', 'Lilac', 'c', 'bbdd', 'Lilová barva', 'Lilac color', 'Lilafarbig'),
('Red', 'Red', 'Rot', 'd', 'O', 'Červená barva', 'Red color', 'Rote Farbe'),
('Cream', 'Cream', 'Creme', 'e', 'O dilute', 'Krémová barva', 'Cream color', 'Cremefarbig'),
('Seal Lynx', 'Seal Lynx', 'Seal Lynx', 'n 21', 'BBDD/BBDd/BbDD/BbDd + tabby', 'Černohnědá s kresbou', 'Seal tabby', 'Seal Tabby'),
('Blue Lynx', 'Blue Lynx', 'Blau Lynx', 'a 21', 'BBdd/Bbdd + tabby', 'Modrá s kresbou', 'Blue tabby', 'Blau Tabby'),
('Chocolate Lynx', 'Chocolate Lynx', 'Schokolade Lynx', 'b 21', 'bbDD/bbDd + tabby', 'Čokoládová s kresbou', 'Chocolate tabby', 'Schokolade Tabby'),
('Lilac Lynx', 'Lilac Lynx', 'Lilac Lynx', 'c 21', 'bbdd + tabby', 'Lilová s kresbou', 'Lilac tabby', 'Lilac Tabby'),
('Seal Tortie', 'Seal Tortie', 'Seal Schildpatt', 'f', 'BBDD/BBDd/BbDD/BbDd + O', 'Černohnědá želvovinová', 'Seal tortoiseshell', 'Seal Schildpatt'),
('Blue Cream', 'Blue Cream', 'Blau-Creme', 'g', 'BBdd/Bbdd + O', 'Modrá želvovinová', 'Blue cream', 'Blau-Creme'),
('Chocolate Tortie', 'Chocolate Tortie', 'Schokolade Schildpatt', 'h', 'bbDD/bbDd + O', 'Čokoládová želvovinová', 'Chocolate tortoiseshell', 'Schokolade Schildpatt'),
('Lilac Cream', 'Lilac Cream', 'Lilac-Creme', 'j', 'bbdd + O', 'Lilová želvovinová', 'Lilac cream', 'Lilac-Creme'),
('Seal Tortie Lynx', 'Seal Tortie Lynx', 'Seal Schildpatt Lynx', 'f 21', 'BBDD/BBDd/BbDD/BbDd + O + tabby', 'Černohnědá želvovinová s kresbou', 'Seal tortie tabby', 'Seal Schildpatt Tabby'),
('Blue Cream Lynx', 'Blue Cream Lynx', 'Blau-Creme Lynx', 'g 21', 'BBdd/Bbdd + O + tabby', 'Modrá želvovinová s kresbou', 'Blue cream tabby', 'Blau-Creme Tabby'),
('Chocolate Tortie Lynx', 'Chocolate Tortie Lynx', 'Schokolade Schildpatt Lynx', 'h 21', 'bbDD/bbDd + O + tabby', 'Čokoládová želvovinová s kresbou', 'Chocolate tortie tabby', 'Schokolade Schildpatt Tabby'),
('Lilac Cream Lynx', 'Lilac Cream Lynx', 'Lilac-Creme Lynx', 'j 21', 'bbdd + O + tabby', 'Lilová želvovinová s kresbou', 'Lilac cream tabby', 'Lilac-Creme Tabby');

-- Sample data for varieties with multilingual support
INSERT INTO varieties (name_cs, name_en, name_de, code, genetic_code, description_cs, description_en, description_de) VALUES
('Colorpoint', 'Colorpoint', 'Colorpoint', '', 'ss', 'Bez bílé barvy', 'No white markings', 'Keine weiße Markierungen'),
('Mitted', 'Mitted', 'Mitted', '04', 'S2s', 'Bílé ponožky a punčošky, bílá brada a břicho', 'White paws, chin and belly', 'Weiße Pfoten, Kinn und Bauch'),
('Bicolor', 'Bicolor', 'Bicolor', '03', 'S4s', 'Bílé obrácené V v masce, bílé nohy a břicho', 'White inverted V on face, white legs and belly', 'Weißes umgekehrtes V im Gesicht, weiße Beine und Bauch'),
('High Mitted', 'High Mitted', 'High Mitted', 'HM', 'S2S2', 'Vzhledově jako bicolor', 'Visually appears as bicolor', 'Visuell wie Bicolor'),
('Bicolor Mid High White', 'Bicolor Mid High White', 'Bicolor Mittelhoch Weiß', 'MHW', 'S4S2', 'Bicolor s vyšším podílem bílé barvy', 'Bicolor with higher proportion of white', 'Bicolor mit höherem Weißanteil'),
('Bicolor High White', 'Bicolor High White', 'Bicolor Hoch Weiß', 'HW', 'S4S4', 'Bicolor s nejvyšším podílem bílé barvy', 'Bicolor with highest proportion of white', 'Bicolor mit höchstem Weißanteil');

-- Sample data for blood types with multilingual support
INSERT INTO blood_types (type, genetic_code, is_carrier, description_cs, description_en, description_de) VALUES
('A', 'Aa', false, 'Krevní skupina A bez vlohy pro B', 'Blood type A without B allele', 'Blutgruppe A ohne B-Allel'),
('A', 'Ab', true, 'Krevní skupina A s vlohou pro B', 'Blood type A carrying B allele', 'Blutgruppe A mit B-Allel'),
('B', 'B', false, 'Krevní skupina B', 'Blood type B', 'Blutgruppe B'),
('AB', 'AB', false, 'Krevní skupina AB', 'Blood type AB', 'Blutgruppe AB');