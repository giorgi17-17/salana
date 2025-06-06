-- Enable Row Level Security
-- Make sure RLS is enabled for all tables

-- 1. Main businesses table
CREATE TABLE public.businesses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    phone VARCHAR(50),
    email VARCHAR(255),
    rating DECIMAL(2,1) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
    review_count INTEGER DEFAULT 0,
    featured BOOLEAN DEFAULT false,
    image VARCHAR(500),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'suspended')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Business locations table
CREATE TABLE public.business_locations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    location_url TEXT,
    image VARCHAR(500),
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Business open hours table
CREATE TABLE public.business_hours (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
    day_of_week INTEGER CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0 = Sunday, 6 = Saturday
    open_time TIME,
    close_time TIME,
    is_closed BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Business services table
CREATE TABLE public.business_services (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    duration INTEGER NOT NULL, -- in minutes
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Business stylists/employees table
CREATE TABLE public.business_stylists (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(255) NOT NULL,
    specialty VARCHAR(255),
    experience VARCHAR(100),
    bio TEXT,
    image VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Add updated_at trigger for businesses table
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_businesses_updated_at 
    BEFORE UPDATE ON public.businesses 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_business_services_updated_at 
    BEFORE UPDATE ON public.business_services 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_business_stylists_updated_at 
    BEFORE UPDATE ON public.business_stylists 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 7. Row Level Security Policies

-- Businesses: Users can only see approved businesses or their own
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public businesses are viewable by everyone" ON public.businesses
    FOR SELECT USING (status = 'approved');

CREATE POLICY "Users can view own business" ON public.businesses
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own business" ON public.businesses
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own business" ON public.businesses
    FOR UPDATE USING (auth.uid() = user_id);

-- Business locations: Viewable if business is approved or user owns it
ALTER TABLE public.business_locations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Business locations viewable for approved businesses" ON public.business_locations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.businesses 
            WHERE businesses.id = business_locations.business_id 
            AND (businesses.status = 'approved' OR businesses.user_id = auth.uid())
        )
    );

CREATE POLICY "Users can manage own business locations" ON public.business_locations
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.businesses 
            WHERE businesses.id = business_locations.business_id 
            AND businesses.user_id = auth.uid()
        )
    );

-- Business hours: Same policy as locations
ALTER TABLE public.business_hours ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Business hours viewable for approved businesses" ON public.business_hours
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.businesses 
            WHERE businesses.id = business_hours.business_id 
            AND (businesses.status = 'approved' OR businesses.user_id = auth.uid())
        )
    );

CREATE POLICY "Users can manage own business hours" ON public.business_hours
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.businesses 
            WHERE businesses.id = business_hours.business_id 
            AND businesses.user_id = auth.uid()
        )
    );

-- Business services: Same policy as locations
ALTER TABLE public.business_services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Business services viewable for approved businesses" ON public.business_services
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.businesses 
            WHERE businesses.id = business_services.business_id 
            AND (businesses.status = 'approved' OR businesses.user_id = auth.uid())
        )
    );

CREATE POLICY "Users can manage own business services" ON public.business_services
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.businesses 
            WHERE businesses.id = business_services.business_id 
            AND businesses.user_id = auth.uid()
        )
    );

-- Business stylists: Same policy as locations
ALTER TABLE public.business_stylists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Business stylists viewable for approved businesses" ON public.business_stylists
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.businesses 
            WHERE businesses.id = business_stylists.business_id 
            AND (businesses.status = 'approved' OR businesses.user_id = auth.uid())
        )
    );

CREATE POLICY "Users can manage own business stylists" ON public.business_stylists
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.businesses 
            WHERE businesses.id = business_stylists.business_id 
            AND businesses.user_id = auth.uid()
        )
    );

-- 6. Bookings table
CREATE TABLE public.bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
    service_id UUID REFERENCES public.business_services(id) ON DELETE SET NULL,
    stylist_id UUID REFERENCES public.business_stylists(id) ON DELETE SET NULL,
    customer_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    customer_notes TEXT,
    booking_date DATE NOT NULL,
    booking_time TIME NOT NULL,
    duration INTEGER NOT NULL, -- in minutes
    total_price DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER update_bookings_updated_at 
    BEFORE UPDATE ON public.bookings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Bookings: Users can view bookings for their business or their own bookings
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Business owners can view their bookings" ON public.bookings
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.businesses 
            WHERE businesses.id = bookings.business_id 
            AND businesses.user_id = auth.uid()
        )
    );

CREATE POLICY "Customers can view their own bookings" ON public.bookings
    FOR SELECT USING (customer_user_id = auth.uid());

CREATE POLICY "Anyone can create bookings" ON public.bookings
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Business owners can update their bookings" ON public.bookings
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.businesses 
            WHERE businesses.id = bookings.business_id 
            AND businesses.user_id = auth.uid()
        )
    );

-- 8. Indexes for better performance
CREATE INDEX idx_businesses_user_id ON public.businesses(user_id);
CREATE INDEX idx_businesses_status ON public.businesses(status);
CREATE INDEX idx_businesses_featured ON public.businesses(featured);
CREATE INDEX idx_business_locations_business_id ON public.business_locations(business_id);
CREATE INDEX idx_business_hours_business_id ON public.business_hours(business_id);
CREATE INDEX idx_business_services_business_id ON public.business_services(business_id);
CREATE INDEX idx_business_stylists_business_id ON public.business_stylists(business_id);
CREATE INDEX idx_bookings_business_id ON public.bookings(business_id);
CREATE INDEX idx_bookings_booking_date ON public.bookings(booking_date);
CREATE INDEX idx_bookings_customer_user_id ON public.bookings(customer_user_id);

-- 9. Sample data insert (based on your salon data)
INSERT INTO public.businesses (user_id, name, description, phone, email, rating, review_count, featured, image, status) 
VALUES (
    '00000000-0000-0000-0000-000000000000', -- Replace with actual user_id
    'ელიტა',
    'პრემიუმ სილამაზის სალონი თბილისის ცენტრში',
    '555 12 34 56',
    'info@elita.ge',
    4.8,
    126,
    true,
    'salon1.jpg',
    'approved'
) RETURNING id; 