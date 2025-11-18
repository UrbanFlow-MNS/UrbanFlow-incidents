 import { registerEnumType } from '@nestjs/postgresql';

export enum InterventionStatus {
    PENDING = 'PENDING',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
}

export enum IncidentPriority {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
    URGENT = 'URGENT',
}

export enum IncidentStatus {
    OPEN = 'OPEN',
    IN_PROGRESS = 'IN_PROGRESS',
    RESOLVED = 'RESOLVED',
    CLOSED = 'CLOSED',
}

registerEnumType(IncidentStatus, {
    name: 'IncidentStatus',
    description: 'The status of an incident',
});

registerEnumType(InterventionStatus, {
    name: 'InterventionStatus',
    description: 'The status of an intervention',
});

registerEnumType(IncidentPriority, {
    name: 'IncidentPriority',
    description: 'The priority of an incident',
});
