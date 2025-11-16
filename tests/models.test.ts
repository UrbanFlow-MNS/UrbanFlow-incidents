import { IncidentStatus, IncidentPriority, InterventionStatus } from '../src/models/incidentsEnums';
import { CategoryModel } from '../src/models/categoryModel';
import { UserAccountModel } from '../src/models/userAccountModel';
import { TechnicianModel } from '../src/models/technicianModel';
import { SiteModel } from '../src/models/siteModel';
import { IncidentModel } from '../src/models/incidentModel';
import { AssignmentModel } from '../src/models/assignmentModel';
import { InterventionModel } from '../src/models/interventionModel';
import { CommentModel } from '../src/models/commentModel';
import { AttachmentModel } from '../src/models/attachmentModel';

describe('Models Tests', () => {
  describe('CategoryModel', () => {
    it('should create a valid category', () => {
      const category: CategoryModel = {
        id: 1,
        categoryName: 'Mecanique',
        isActive: true,
      };

      expect(category.id).toBe(1);
      expect(category.categoryName).toBe('Mecanique');
      expect(category.isActive).toBe(true);
    });
  });

  describe('UserAccountModel', () => {
    it('should create a valid user account', () => {
      const user: UserAccountModel = {
        id: 1,
        email: 'tomas-dumbass@urbanflow.com',
        name: 'Dumbass',
        firstName: 'Thomas',
        role: 'TECH',
        isActive: true,
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-01-01'),
      };

      expect(user.id).toBe(1);
      expect(user.email).toBe('tech@urbanflow.com');
      expect(user.role).toBe('TECH');
      expect(user.isActive).toBe(true);
    });
  });

  describe('TechnicianModel', () => {
    it('should create a valid technician', () => {
      const technician: TechnicianModel = {
        id: 1,
        userAccountId: 1,
        phone: '+33612345678',
        skills: ['Mecanique Bus', 'Moteurs Diesel', 'Systemes Electriques'],
        isOnDuty: true,
        locationLat: 48.8566,
        locationLng: 2.3522,
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-01-01'),
      };

      expect(technician.id).toBe(1);
      expect(technician.userAccountId).toBe(1);
      expect(technician.skills).toHaveLength(3);
      expect(technician.isOnDuty).toBe(true);
    });

    it('should allow optional location fields', () => {
      const technician: TechnicianModel = {
        id: 2,
        userAccountId: 2,
        phone: '+33687654321',
        skills: ['Maintenance Tramway'],
        isOnDuty: false,
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-01-01'),
      };

      expect(technician.locationLat).toBeUndefined();
      expect(technician.locationLng).toBeUndefined();
    });
  });

  describe('SiteModel', () => {
    it('should create a valid site', () => {
      const site: SiteModel = {
        id: 1,
        name: 'Depot Bus Nord',
        address: '31 Rue de la Gare',
        city: 'Cattenom',
        zipcode: '57570',
        gpsLat: 49.8566,
        gpsLng: 6.6523,
        contactName: 'Chef de depot Thomas',
        contactPhone: '+33612345678',
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-01-01'),
      };

      expect(site.id).toBe(1);
      expect(site.city).toBe('Cattenom');
      expect(site.zipcode).toBe('57570');
    });

    it('should allow optional contact fields', () => {
      const site: SiteModel = {
        id: 2,
        name: 'Station Tramway Centre',
        address: '456 Boulevard des Transports',
        city: 'Nancy',
        zipcode: '54000',
        gpsLat: 45.7640,
        gpsLng: 4.8357,
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-01-01'),
      };

      expect(site.contactName).toBeUndefined();
      expect(site.contactPhone).toBeUndefined();
    });
  });

  describe('IncidentModel', () => {
    it('should create a valid incident', () => {
      const incident: IncidentModel = {
        id: 1,
        code: 'INC-2025-001',
        name: 'Panne moteur bus ligne 42',
        description: 'Le bus 1234 presente une panne moteur a larret République',
        status: IncidentStatus.OPEN,
        priority: IncidentPriority.HIGH,
        creationDate: new Date('2025-01-01'),
        siteId: 1,
        categoryId: 1,
        createdById: 1,
        updatedAt: new Date('2025-01-01'),
      };

      expect(incident.code).toBe('INC-2025-001');
      expect(incident.status).toBe(IncidentStatus.OPEN);
      expect(incident.priority).toBe(IncidentPriority.HIGH);
    });

    it('should allow optional resolutionDate', () => {
      const incident: IncidentModel = {
        id: 1,
        code: 'INC-2025-002',
        name: 'Tramway bloque',
        description: 'Incident resolu sur la ligne T1',
        status: IncidentStatus.RESOLVED,
        priority: IncidentPriority.LOW,
        creationDate: new Date('2025-01-01'),
        resolutionDate: new Date('2025-01-02'),
        siteId: 1,
        categoryId: 1,
        createdById: 1,
        updatedAt: new Date('2025-01-02'),
      };

      expect(incident.resolutionDate).toBeDefined();
      expect(incident.status).toBe(IncidentStatus.RESOLVED);
    });
  });

  describe('AssignmentModel', () => {
    it('should create a valid assignment', () => {
      const assignment: AssignmentModel = {
        id: 1,
        incidentId: 1,
        technicianId: 1,
        isPrimary: true,
        assignedAt: new Date('2025-01-01'),
      };

      expect(assignment.incidentId).toBe(1);
      expect(assignment.technicianId).toBe(1);
      expect(assignment.isPrimary).toBe(true);
    });

    it('should allow optional acceptance and decline dates', () => {
      const assignment: AssignmentModel = {
        id: 2,
        incidentId: 1,
        technicianId: 2,
        isPrimary: false,
        assignedAt: new Date('2025-01-01'),
        acceptedAt: new Date('2025-01-01T10:00:00'),
        note: 'Technicien secondaire',
      };

      expect(assignment.acceptedAt).toBeDefined();
      expect(assignment.note).toBe('Technicien secondaire');
    });
  });

  describe('InterventionModel', () => {
    it('should create a valid intervention', () => {
      const intervention: InterventionModel = {
        id: 1,
        assignmentId: 1,
        siteId: 1,
        startAt: new Date('2025-01-01T08:00:00'),
        status: InterventionStatus.PLANNED,
        workNotes: 'Remplacement du moteur du bus',
        travelTimes: 30,
        workTimes: 120,
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-01-01'),
      };

      expect(intervention.status).toBe(InterventionStatus.PLANNED);
      expect(intervention.travelTimes).toBe(30);
      expect(intervention.workTimes).toBe(120);
    });

    it('should allow optional fields', () => {
      const intervention: InterventionModel = {
        id: 2,
        assignmentId: 1,
        siteId: 1,
        startAt: new Date('2025-01-01T08:00:00'),
        endAt: new Date('2025-01-01T12:00:00'),
        status: InterventionStatus.DONE,
        workNotes: 'Reparation terminee, bus operationnel',
        travelTimes: 30,
        workTimes: 120,
        customerSignatureName: 'Chef de depot Dupont',
        customerSignatureImage: 'base64encodedimage',
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-01-01'),
      };

      expect(intervention.endAt).toBeDefined();
      expect(intervention.customerSignatureName).toBe('Chef de depot Dupont');
    });
  });

  describe('CommentModel', () => {
    it('should create a valid comment', () => {
      const comment: CommentModel = {
        id: 1,
        incidentId: 1,
        authorId: 1,
        content: 'Diagnostic effectue: probleme de surchauffe moteur',
        addDate: new Date('2025-01-01'),
      };

      expect(comment.incidentId).toBe(1);
      expect(comment.authorId).toBe(1);
      expect(comment.content).toBe('Diagnostic effectue: probleme de surchauffe moteur');
    });
  });

  describe('AttachmentModel', () => {
    it('should create a valid attachment', () => {
      const attachment: AttachmentModel = {
        id: 1,
        incidentId: 1,
        uploadedById: 1,
        contentUrl: 'https://storage.urbanflow.com/photo_bus_1234.jpg',
        attachmentDate: new Date('2025-01-01'),
        contentType: 'image/jpeg',
      };

      expect(attachment.contentUrl).toBe('https://storage.urbanflow.com/photo_bus_1234.jpg');
      expect(attachment.contentType).toBe('image/jpeg');
    });

    it('should allow optional fields', () => {
      const attachment: AttachmentModel = {
        id: 1,
        incidentId: 1,
        uploadedById: 1,
        contentUrl: 'https://storage.urbanflow.com/rapport_intervention.pdf',
        attachmentDate: new Date('2025-01-01'),
        note: 'Rapport technique de la reparation',
        contentType: 'application/pdf',
      };

      expect(attachment.note).toBe('Rapport technique de la reparation');
    });
  });
});
