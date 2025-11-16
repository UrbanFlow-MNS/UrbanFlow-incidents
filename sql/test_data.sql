-- Script de test pour vérifier que la base de données fonctionne correctement

-- 1. Insertion de données de test
INSERT INTO categories (categoryName, isActive) VALUES 
    ('Mecanique', true),
    ('Electrique', true),
    ('Carrosserie', true);

INSERT INTO user_accounts (email, name, firstName, role, isActive) VALUES 
    ('tech1@urbanflow.com', 'Dupont', 'Jean', 'TECH', true),
    ('admin@urbanflow.com', 'Martin', 'Sophie', 'ADMIN', true);

INSERT INTO technicians (userAccountId, phone, skills, isOnDuty) VALUES 
    (1, '+33612345678', ARRAY['Mecanique Bus', 'Moteurs Diesel'], true);

INSERT INTO sites (name, address, city, zipcode, gpsLat, gpsLng, contactName, contactPhone) VALUES 
    ('Depot Bus Nord', '123 Avenue du Transport', 'Paris', '75018', 48.8566, 2.3522, 'Chef de depot', '+33612345678');

INSERT INTO incidents (code, name, description, status, priority, siteId, categoryId, createdById) VALUES 
    ('INC-2025-001', 'Panne moteur bus ligne 42', 'Le bus 1234 presente une panne moteur', 'OPEN', 'HIGH', 1, 1, 1);

INSERT INTO assignments (incidentId, technicianId, isPrimary) VALUES 
    (1, 1, true);

INSERT INTO interventions (assignmentId, siteId, startAt, status, workNotes, travelTimes, workTimes) VALUES 
    (1, 1, NOW(), 'PLANNED', 'Intervention planifiee pour remplacement moteur', 30, 120);

INSERT INTO comments (incidentId, authorId, content) VALUES 
    (1, 1, 'Diagnostic effectue: probleme de surchauffe moteur');

INSERT INTO attachments (incidentId, uploadedById, contentUrl, contentType) VALUES 
    (1, 1, 'https://storage.urbanflow.com/photo_bus_1234.jpg', 'image/jpeg');

-- 2. Vérification des données insérées
SELECT 'Categories' as Table_Name, COUNT(*) as Count FROM categories
UNION ALL
SELECT 'User Accounts', COUNT(*) FROM user_accounts
UNION ALL
SELECT 'Technicians', COUNT(*) FROM technicians
UNION ALL
SELECT 'Sites', COUNT(*) FROM sites
UNION ALL
SELECT 'Incidents', COUNT(*) FROM incidents
UNION ALL
SELECT 'Assignments', COUNT(*) FROM assignments
UNION ALL
SELECT 'Interventions', COUNT(*) FROM interventions
UNION ALL
SELECT 'Comments', COUNT(*) FROM comments
UNION ALL
SELECT 'Attachments', COUNT(*) FROM attachments;

-- 3. Test des relations (jointures)
SELECT 
    i.code as incident_code,
    i.name as incident_name,
    i.status,
    i.priority,
    s.name as site_name,
    c.categoryName as category,
    u.email as created_by
FROM incidents i
JOIN sites s ON i.siteId = s.id
JOIN categories c ON i.categoryId = c.id
JOIN user_accounts u ON i.createdById = u.id;

-- 4. Test des affectations avec techniciens
SELECT 
    i.code as incident_code,
    t.phone as technician_phone,
    a.isPrimary,
    a.assignedAt
FROM assignments a
JOIN incidents i ON a.incidentId = i.id
JOIN technicians t ON a.technicianId = t.id;

-- Résultat attendu : 
-- Si tout fonctionne, vous devriez voir les données insérées et les jointures fonctionnelles
