-- Payments table for Salana platform
CREATE TABLE public.payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
    amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
    currency VARCHAR(3) DEFAULT 'GEL' NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled')),
    payment_method VARCHAR(50) NOT NULL CHECK (payment_method IN ('credit_card', 'debit_card', 'bank_transfer', 'paypal', 'stripe', 'cash')),
    transaction_id VARCHAR(255) UNIQUE,
    payment_processor VARCHAR(50) DEFAULT 'bog',
    description TEXT,
    customer_name VARCHAR(255),
    customer_email VARCHAR(255),
    customer_phone VARCHAR(50),
    billing_address JSONB,
    metadata JSONB,
    processed_at TIMESTAMPTZ,
    refunded_at TIMESTAMPTZ,
    refund_amount DECIMAL(10,2) DEFAULT 0 CHECK (refund_amount >= 0),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_payments_business_id ON public.payments(business_id);
CREATE INDEX idx_payments_status ON public.payments(status);
CREATE INDEX idx_payments_created_at ON public.payments(created_at);
CREATE INDEX idx_payments_transaction_id ON public.payments(transaction_id);

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_payments_updated_at 
    BEFORE UPDATE ON public.payments 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Business owners can view their own payments
CREATE POLICY "Business owners can view their payments" ON public.payments
    FOR SELECT USING (
        business_id IN (
            SELECT id FROM public.businesses 
            WHERE user_id = auth.uid()
        )
    );

-- Allow service role and business owners to create payments
CREATE POLICY "Allow payment creation" ON public.payments
    FOR INSERT WITH CHECK (
        -- Allow if no authenticated user (service role operation)
        auth.uid() IS NULL
        OR
        -- Allow if business belongs to authenticated user
        business_id IN (
            SELECT id FROM public.businesses 
            WHERE user_id = auth.uid()
        )
    ); 