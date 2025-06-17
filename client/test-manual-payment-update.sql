-- Test manual payment status update
-- Replace 'your_transaction_id' with the actual transaction_id from your payment

UPDATE public.payments 
SET 
    status = 'completed',
    processed_at = NOW()
WHERE transaction_id = 'f1c87817-4f85-41c7-9d15-6e478ea7878a';

-- Check the result
SELECT * FROM public.payments WHERE transaction_id = 'f1c87817-4f85-41c7-9d15-6e478ea7878a'; 