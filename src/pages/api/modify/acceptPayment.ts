import { NextApiRequest, NextApiResponse } from 'next'
import { getTursoClient } from '@/pages/api/components/dbAuth'
import sendEmail from '@/pages/api/internal/sendEmail';
import authAdmin from '@/pages/api/internal/authAdmin';
import preFlightChecks from '@/pages/api/internal/preFlightChecks';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await preFlightChecks(req, res);
    await authAdmin(req, res);

    const { email } = req.body
    try {
        const turso = getTursoClient()

        const userResult = await turso.execute({
        sql: 'SELECT id FROM users WHERE email = ?',
        args: [email],
        })
        if (userResult.rows.length === 0) {
        return res.status(404).json({ message: 'User not found' })
        }
        const id = userResult.rows[0].id

        // Update payments table; insert if not exists
        const paymentsUpdateResult = await turso.execute({
        sql: `
        UPDATE payments
        SET status = "Completed"
        WHERE id = ?
        `,
        args: [id],
        })


        await sendEmail(email, 'Payment Processed', `Your payment has been processed successfully. <br />Thank you for helping support PLISMUN!`);
        res.status(200).json({ message: 'Payment information updated successfully' })
    } catch (err: any) {
        res.status(500).json({ message: err.message || 'Something went wrong' })
    }

}