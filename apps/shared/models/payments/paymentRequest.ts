import { Participent } from "./participent"

export interface PaymentRequest {
    participents: Participent[];
    totalPayment: number;
    description?: string;
};