import pool from '../db/dbconnector';
import { getCreditCardTypes, applyCreditCard } from '../db/queries';

class CreditCardController {
  public async applyCreditCard(req, res) {
    try {
      const client = await pool.connect();
      const { customer_id, card_type, credit_score } = req.body;
      const { rows : cards  }  = await client.query(getCreditCardTypes);
      let isValidType = false;
      let card_type_id;

      for (const card of cards) {
        if (card.card_type == card_type) {
          if (card.minimum_score > credit_score) throw new Error ("Application denied. Please check the mail within 2 weeks to see more details");
          
          card_type_id = card.credit_card_type_id;
          isValidType = true;
        }
      }

      if (!isValidType || !card_type_id) throw new Error ("Wrong card type. Please enter a valid card type");
      
      await client.query(applyCreditCard, [customer_id, card_type_id]);

      client.release();

      res.send({ message: 'Congratulation! Your Credit Card application has been approved' });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  }
}

export default CreditCardController;