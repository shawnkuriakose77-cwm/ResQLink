export type RequestStatus = 'TRIAGED'|'ASSIGNED'|'EN ROUTE'|'ON SCENE'|'COMPLETED'|'CANCELLED';
export type EmergencyRequest = {id:string;incidentType:string;text:string;urgency:'LOW'|'MODERATE'|'HIGH'|'CRITICAL';status:RequestStatus;created:string;people:number;responder?:string;eta?:number;needs:string[];location:string;source:'USER-REPORTED'|'SIMULATED';photo?:string};
