import { IncidentStatus, IncidentPriority, InterventionStatus } from '../src/models/incidentsEnums';

describe('Enums Tests', () => {
  describe('IncidentStatus', () => {
    it('should have all required values', () => {
      expect(Object.values(IncidentStatus)).toEqual([
        'OPEN',
        'ASSIGNED',
        'IN_PROGRESS',
        'RESOLVED',
        'CLOSED'
      ]);
    });

    it('should allow access to specific status', () => {
      expect(IncidentStatus.OPEN).toBe('OPEN');
      expect(IncidentStatus.CLOSED).toBe('CLOSED');
    });
  });

  describe('IncidentPriority', () => {
    it('should have all required values', () => {
      expect(Object.values(IncidentPriority)).toEqual([
        'LOW',
        'MEDIUM',
        'HIGH',
        'CRITICAL'
      ]);
    });

    it('should allow access to specific priority', () => {
      expect(IncidentPriority.LOW).toBe('LOW');
      expect(IncidentPriority.CRITICAL).toBe('CRITICAL');
    });
  });

  describe('InterventionStatus', () => {
    it('should have all required values', () => {
      expect(Object.values(InterventionStatus)).toEqual([
        'PLANNED',
        'IN_PROGRESS',
        'DONE'
      ]);
    });

    it('should allow access to specific status', () => {
      expect(InterventionStatus.PLANNED).toBe('PLANNED');
      expect(InterventionStatus.DONE).toBe('DONE');
    });
  });
});
