import { Injectable } from '@nestjs/common';
import { Participent } from "../../../../shared/models/payments/participent";
import { PaymentRequest } from "../../../../shared/models/payments/paymentRequest";
@Injectable()
export class PaymentService {
    public newPayment(payment: PaymentRequest) {
        const lendersAndBorrowers = this.getLendersAndBorrowers(payment.participents, payment.totalPayment);
        const result = this.splitLogic(lendersAndBorrowers.lenders, lendersAndBorrowers.borrowers).filter(entity => entity.amount > 0);

        return result;
    }

    splitLogic(lenders: Map<string, number>, borrowers: Map<string, number>) {
        let debts: { payTo: string, payFrom: string, amount: number }[] = [];
        let newLenders = lenders;
        let newBorrowers = borrowers;
        Array.from(lenders.keys()).forEach((lenderId: string) => {
            Array.from(borrowers.keys()).forEach((borrowerId: string) => {
                if ((newLenders.get(lenderId) - newBorrowers.get(borrowerId)) >= 0) {
                    debts.push({
                        payFrom: borrowerId,
                        payTo: lenderId,
                        amount: newBorrowers.get(borrowerId)
                    });
                    newLenders.set(lenderId, newLenders.get(lenderId) - newBorrowers.get(borrowerId));
                    newBorrowers.set(borrowerId, 0);
                } else {
                    debts.push({
                        payFrom: borrowerId,
                        payTo: lenderId,
                        amount: newLenders.get(lenderId)
                    });
                    newBorrowers.set(borrowerId, newBorrowers.get(borrowerId) - newLenders.get(lenderId));
                    newLenders.set(lenderId, 0)
                }
            })
        });

        return debts;
    }

    getLendersAndBorrowers(participents: Participent[], totalPayment: number): { lenders: Map<string, number>, borrowers: Map<string, number> } {
        let lenders: Map<string, number> = new Map();
        let borrowers: Map<string, number> = new Map();
        const splittedPayment = Math.round(totalPayment / participents.length);
        participents.forEach(participent => {
            (participent.amount - splittedPayment > 0) ?
                lenders.set(participent.user, participent.amount - splittedPayment) :
                borrowers.set(participent.user, splittedPayment - participent.amount)
        })

        return { lenders, borrowers };
    }
} 