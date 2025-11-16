-- ===================================================================
-- Schema SQL pour le microservice incidents (Urban Flow)
-- Compatible PostgreSQL
-- ===================================================================

-- Création des types ENUM pour les statuts et priorités
CREATE TYPE incident_status AS ENUM ('OPEN', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED');
CREATE TYPE incident_priority AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');
CREATE TYPE intervention_status AS ENUM ('PLANNED', 'IN_PROGRESS', 'DONE');

-- ===================================================================
-- Table: categories
-- ===================================================================
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    categoryName VARCHAR(255) NOT NULL,
    isActive BOOLEAN NOT NULL DEFAULT TRUE
);

-- ===================================================================
-- Table: user_accounts
-- ===================================================================
CREATE TABLE user_accounts (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    firstName VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    isActive BOOLEAN NOT NULL DEFAULT TRUE,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ===================================================================
-- Table: technicians
-- ===================================================================
CREATE TABLE technicians (
    id SERIAL PRIMARY KEY,
    userAccountId INT NOT NULL,
    phone VARCHAR(50) NOT NULL,
    skills TEXT[] NOT NULL,
    isOnDuty BOOLEAN NOT NULL DEFAULT FALSE,
    locationLat DECIMAL(10, 8),
    locationLng DECIMAL(11, 8),
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_technicians_account FOREIGN KEY (userAccountId) 
        REFERENCES user_accounts(id) ON DELETE CASCADE
);

-- ===================================================================
-- Table: sites
-- ===================================================================
CREATE TABLE sites (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(500) NOT NULL,
    city VARCHAR(255) NOT NULL,
    zipcode VARCHAR(20) NOT NULL,
    gpsLat DECIMAL(10, 8) NOT NULL,
    gpsLng DECIMAL(11, 8) NOT NULL,
    contactName VARCHAR(255),
    contactPhone VARCHAR(50),
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ===================================================================
-- Table: incidents
-- ===================================================================
CREATE TABLE incidents (
    id SERIAL PRIMARY KEY,
    code VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status incident_status NOT NULL DEFAULT 'OPEN',
    priority incident_priority NOT NULL DEFAULT 'MEDIUM',
    creationDate TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    resolutionDate TIMESTAMP,
    siteId INT NOT NULL,
    categoryId INT NOT NULL,
    createdById INT NOT NULL,
    updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_incidents_site FOREIGN KEY (siteId) 
        REFERENCES sites(id) ON DELETE RESTRICT,
    CONSTRAINT fk_incidents_category FOREIGN KEY (categoryId) 
        REFERENCES categories(id) ON DELETE RESTRICT,
    CONSTRAINT fk_incidents_createdBy FOREIGN KEY (createdById) 
        REFERENCES user_accounts(id) ON DELETE RESTRICT
);

-- ===================================================================
-- Table: assignments
-- ===================================================================
CREATE TABLE assignments (
    id SERIAL PRIMARY KEY,
    incidentId INT NOT NULL,
    technicianId INT NOT NULL,
    isPrimary BOOLEAN NOT NULL DEFAULT FALSE,
    assignedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    acceptedAt TIMESTAMP,
    declinedAt TIMESTAMP,
    note TEXT,
    CONSTRAINT fk_assignments_incident FOREIGN KEY (incidentId) 
        REFERENCES incidents(id) ON DELETE CASCADE,
    CONSTRAINT fk_assignments_technician FOREIGN KEY (technicianId) 
        REFERENCES technicians(id) ON DELETE CASCADE
);

-- ===================================================================
-- Table: interventions
-- ===================================================================
CREATE TABLE interventions (
    id SERIAL PRIMARY KEY,
    assignmentId INT NOT NULL,
    siteId INT NOT NULL,
    startAt TIMESTAMP NOT NULL,
    endAt TIMESTAMP,
    status intervention_status NOT NULL DEFAULT 'PLANNED',
    workNotes TEXT NOT NULL,
    travelTimes INT NOT NULL DEFAULT 0,
    workTimes INT NOT NULL DEFAULT 0,
    customerSignatureName VARCHAR(255),
    customerSignatureImage TEXT,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_interventions_assignment FOREIGN KEY (assignmentId) 
        REFERENCES assignments(id) ON DELETE CASCADE,
    CONSTRAINT fk_interventions_site FOREIGN KEY (siteId) 
        REFERENCES sites(id) ON DELETE RESTRICT
);

-- ===================================================================
-- Table: comments
-- ===================================================================
CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    incidentId INT NOT NULL,
    authorId INT NOT NULL,
    content TEXT NOT NULL,
    addDate TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_comments_incident FOREIGN KEY (incidentId) 
        REFERENCES incidents(id) ON DELETE CASCADE,
    CONSTRAINT fk_comments_author FOREIGN KEY (authorId) 
        REFERENCES user_accounts(id) ON DELETE CASCADE
);

-- ===================================================================
-- Table: attachments
-- ===================================================================
CREATE TABLE attachments (
    id SERIAL PRIMARY KEY,
    incidentId INT NOT NULL,
    uploadedById INT NOT NULL,
    contentUrl VARCHAR(1000) NOT NULL,
    attachmentDate TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    note TEXT,
    contentType VARCHAR(100),
    CONSTRAINT fk_attachments_incident FOREIGN KEY (incidentId) 
        REFERENCES incidents(id) ON DELETE CASCADE,
    CONSTRAINT fk_attachments_uploadedBy FOREIGN KEY (uploadedById) 
        REFERENCES user_accounts(id) ON DELETE CASCADE
);

-- ===================================================================
-- Index pour améliorer les performances
-- ===================================================================
CREATE INDEX idx_incidents_status ON incidents(status);
CREATE INDEX idx_incidents_priority ON incidents(priority);
CREATE INDEX idx_incidents_site ON incidents(siteId);
CREATE INDEX idx_incidents_category ON incidents(categoryId);
CREATE INDEX idx_assignments_incident ON assignments(incidentId);
CREATE INDEX idx_assignments_technician ON assignments(technicianId);
CREATE INDEX idx_interventions_assignment ON interventions(assignmentId);
CREATE INDEX idx_comments_incident ON comments(incidentId);
CREATE INDEX idx_attachments_incident ON attachments(incidentId);
