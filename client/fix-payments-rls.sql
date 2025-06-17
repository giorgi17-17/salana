-- Fix RLS policies for payments table

-- Drop the conflicting policies
DROP POLICY IF EXISTS "Business owners can create payments" ON public.payments;
DROP POLICY IF EXISTS "Service role can manage payments" ON public.payments;

-- Create the correct policy that allows both service role and authenticated users
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

-- Also update the UPDATE policy to allow service role operations
DROP POLICY IF EXISTS "Business owners can update their payments" ON public.payments;

CREATE POLICY "Allow payment updates" ON public.payments
    FOR UPDATE USING (
        -- Allow if no authenticated user (service role operation)
        auth.uid() IS NULL
        OR
        -- Allow if business belongs to authenticated user
        business_id IN (
            SELECT id FROM public.businesses 
            WHERE user_id = auth.uid()
        )
    ); 