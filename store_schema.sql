CREATE TABLE IF NOT EXISTS public.users (
  id                    UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name                  TEXT,
  email                 TEXT UNIQUE NOT NULL,
  phone                 TEXT,
  role                  TEXT NOT NULL DEFAULT 'store_owner' CHECK (role IN ('admin', 'store_owner')),
  status                TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('active', 'pending', 'inactive')),
  wallet_yer            NUMERIC NOT NULL DEFAULT 0,
  referral_code         TEXT UNIQUE,
  pending_wallet_balance NUMERIC NOT NULL DEFAULT 0,
  referred_by           UUID REFERENCES public.users(id) ON DELETE SET NULL,
  last_login            TIMESTAMPTZ,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_select_own" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "users_update_own" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "admin_all_users" ON public.users
  USING (EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin'));


-- ============================================================
-- 1.1 PACKAGES — باقات الاشتراك المتاحة
-- ============================================================
CREATE TABLE IF NOT EXISTS public.packages (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        JSONB NOT NULL, -- {"ar": "...", "en": "...", "zh": "..."}
  description JSONB,
  price       NUMERIC NOT NULL DEFAULT 0,
  category    TEXT NOT NULL CHECK (category IN ('design', 'web', 'store')),
  features    JSONB,
  limits      JSONB NOT NULL DEFAULT '{}'::jsonb, -- e.g., {"max_products": 100, "max_orders": 500}
  is_active   BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "packages_public_read" ON public.packages
  FOR SELECT USING (is_active = true);

CREATE POLICY "admin_all_packages" ON public.packages
  FOR ALL USING (EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin'));

-- Update users table to reference packages
ALTER TABLE public.users ADD COLUMN package_id UUID REFERENCES public.packages(id) ON DELETE SET NULL;


-- ============================================================
-- 1.2 SUBSCRIPTIONS — اشتراكات المستخدمين في الباقات
-- ============================================================
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  package_id      UUID NOT NULL REFERENCES public.packages(id) ON DELETE CASCADE,
  status          TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled')),
  starts_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  ends_at         TIMESTAMPTZ,
  payment_status  TEXT NOT NULL DEFAULT 'paid' CHECK (payment_status IN ('pending', 'paid', 'failed')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "subscriptions_own" ON public.subscriptions
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "admin_all_subscriptions" ON public.subscriptions
  FOR ALL USING (EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin'));


-- ============================================================
-- 2. STORES — المتاجر
-- ============================================================
CREATE TABLE IF NOT EXISTS public.stores (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id      UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  store_name    TEXT NOT NULL,
  store_url     TEXT UNIQUE NOT NULL,
  store_niche   TEXT DEFAULT 'عام',
  logo          TEXT,
  description   TEXT,
  whatsapp      TEXT,
  email_contact TEXT,
  instagram     TEXT,
  facebook      TEXT,
  auto_message  TEXT,
  theme_color   TEXT DEFAULT 'Dark',
  template_id   TEXT,
  is_active     BOOLEAN NOT NULL DEFAULT false,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.categories (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id   UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  name       TEXT NOT NULL,
  img        TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.products (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id       UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  category_id    UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  name           TEXT NOT NULL,
  description    TEXT,
  price          NUMERIC NOT NULL DEFAULT 0,
  discount_price NUMERIC,
  img            TEXT,
  stock          INTEGER DEFAULT 0,
  sales_count    INTEGER NOT NULL DEFAULT 0,
  is_active      BOOLEAN NOT NULL DEFAULT true,
  is_new         BOOLEAN NOT NULL DEFAULT false,
  is_best_seller BOOLEAN NOT NULL DEFAULT false,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.store_customers (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id    UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  supabase_id UUID,
  name        TEXT NOT NULL,
  email       TEXT,
  phone       TEXT,
  wallet      NUMERIC NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (store_id, email)
);

CREATE TABLE IF NOT EXISTS public.orders (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id         UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  customer_id      UUID REFERENCES public.store_customers(id) ON DELETE SET NULL,
  items            JSONB NOT NULL DEFAULT '[]',
  total            NUMERIC NOT NULL DEFAULT 0,
  discount         NUMERIC NOT NULL DEFAULT 0,
  coupon_code      TEXT,
  status           TEXT NOT NULL DEFAULT 'pending'
                   CHECK (status IN ('pending','processing','shipped','delivered','cancelled')),
  payment_method   TEXT,
  shipping_address JSONB,
  notes            TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.coupons (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id       UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  code           TEXT NOT NULL,
  discount_type  TEXT NOT NULL DEFAULT 'percent' CHECK (discount_type IN ('percent', 'fixed')),
  discount_value NUMERIC NOT NULL DEFAULT 0,
  min_order      NUMERIC DEFAULT 0,
  max_uses       INTEGER,
  used_count     INTEGER NOT NULL DEFAULT 0,
  expires_at     TIMESTAMPTZ,
  is_active      BOOLEAN NOT NULL DEFAULT true,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (store_id, code)
);

CREATE TABLE IF NOT EXISTS public.banners (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id   UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  img        TEXT NOT NULL,
  title      TEXT,
  link       TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active  BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.offers (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id       UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  product_id     UUID REFERENCES public.products(id) ON DELETE CASCADE,
  category_id    UUID REFERENCES public.categories(id) ON DELETE CASCADE,
  discount_type  TEXT NOT NULL DEFAULT 'percent' CHECK (discount_type IN ('percent', 'fixed')),
  discount_value NUMERIC NOT NULL DEFAULT 0,
  starts_at      TIMESTAMPTZ,
  ends_at        TIMESTAMPTZ,
  is_active      BOOLEAN NOT NULL DEFAULT true,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.addresses (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES public.store_customers(id) ON DELETE CASCADE,
  full_name   TEXT NOT NULL,
  phone       TEXT NOT NULL,
  city        TEXT NOT NULL,
  area        TEXT NOT NULL,
  details     TEXT NOT NULL,
  notes       TEXT,
  is_default  BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "addresses_customer_self" ON public.addresses
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.store_customers sc WHERE sc.id = customer_id AND sc.supabase_id = auth.uid())
  );

CREATE POLICY "addresses_store_owner" ON public.addresses
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.store_customers sc
      JOIN public.stores s ON s.id = sc.store_id
      WHERE sc.id = customer_id AND s.owner_id = auth.uid()
    )
  );

CREATE TABLE IF NOT EXISTS public.recharge_requests (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  amount      NUMERIC NOT NULL CHECK (amount > 0),
  status      TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  user_name   TEXT,
  user_email  TEXT,
  receipt_img TEXT,
  notes       TEXT,
  reviewed_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.recharge_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "recharge_requests_own" ON public.recharge_requests
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "recharge_requests_insert_own" ON public.recharge_requests
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "recharge_requests_admin" ON public.recharge_requests
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin')
  );


-- ============================================================
-- 12. WITHDRAWAL_REQUESTS — طلبات السحب (مستخدم → مدير)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.withdrawal_requests (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id        UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  amount         NUMERIC NOT NULL CHECK (amount > 0),
  bank_name      TEXT NOT NULL,
  account_number TEXT NOT NULL,
  account_holder TEXT NOT NULL,
  status         TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  notes          TEXT,
  reviewed_by    UUID REFERENCES public.users(id) ON DELETE SET NULL,
  reviewed_at    TIMESTAMPTZ,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.withdrawal_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "withdrawal_requests_own" ON public.withdrawal_requests
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "withdrawal_requests_insert_own" ON public.withdrawal_requests
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "withdrawal_requests_admin" ON public.withdrawal_requests
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin')
  );


-- ============================================================
-- 13. WALLET_CHARGES — شحن محافظ العملاء (مستخدم → عميل)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.wallet_charges (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id    UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES public.store_customers(id) ON DELETE CASCADE,
  amount      NUMERIC NOT NULL CHECK (amount > 0),
  description TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.transactions (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  amount      NUMERIC NOT NULL,
  type        TEXT NOT NULL
              CHECK (type IN ('recharge','withdrawal','subscription','wallet_charge','referral_reward','transfer')),
  description TEXT,
  ref_id      UUID,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "transactions_own" ON public.transactions
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "transactions_admin" ON public.transactions
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin')
  );


-- ============================================================
-- 15. NOTIFICATIONS — الإشعارات (مع Realtime)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID,
  role       TEXT CHECK (role IN ('user','admin','customer')),
  type       TEXT NOT NULL
             CHECK (type IN ('order','payment','wallet','coupon','system')),
  title      TEXT NOT NULL,
  message    TEXT NOT NULL,
  data       JSONB,
  is_read    BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for fast user lookups
CREATE INDEX IF NOT EXISTS notifications_user_id_idx ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS notifications_role_idx ON public.notifications(role);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "notifications_own" ON public.notifications
  FOR SELECT USING (user_id = auth.uid() OR role IS NOT NULL);

CREATE POLICY "notifications_mark_read" ON public.notifications
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "notifications_delete_own" ON public.notifications
  FOR DELETE USING (user_id = auth.uid());

CREATE POLICY "notifications_insert_admin_or_system" ON public.notifications
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL OR true
  );

-- Enable Realtime on notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;


-- ============================================================
-- 16. NOTIFICATION_LOGS — سجل تنفيذ أوامر الإشعارات
-- ============================================================
CREATE TABLE IF NOT EXISTS public.notification_logs (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  command    TEXT NOT NULL,
  payload    TEXT,
  status     TEXT NOT NULL CHECK (status IN ('success','error')),
  error      TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.notification_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "notification_logs_admin" ON public.notification_logs
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin')
  );


-- ============================================================
-- 17. SUPPORT_MESSAGES — رسائل الدعم الفني
-- ============================================================
CREATE TABLE IF NOT EXISTS public.support_messages (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID REFERENCES public.users(id) ON DELETE SET NULL,
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  subject    TEXT,
  message    TEXT NOT NULL,
  status     TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open','in_progress','resolved')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.support_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "support_messages_own" ON public.support_messages
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "support_messages_insert" ON public.support_messages
  FOR INSERT WITH CHECK (true);

CREATE POLICY "support_messages_admin" ON public.support_messages
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin')
  );


-- ============================================================
-- 18. REFERRALS — نظام الإحالة والتسويق بالعمولة
-- ============================================================
CREATE TABLE IF NOT EXISTS public.referrals (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  referrer_id         UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  referred_user_id    UUID REFERENCES public.users(id) ON DELETE SET NULL,
  referral_code       TEXT NOT NULL,
  status              TEXT NOT NULL DEFAULT 'pending'
                      CHECK (status IN ('pending','subscribed','rewarded')),
  reward_amount       NUMERIC NOT NULL DEFAULT 0,
  reward_paid         BOOLEAN NOT NULL DEFAULT false,
  subscription_ref_id UUID,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "referrals_own" ON public.referrals
  FOR SELECT USING (referrer_id = auth.uid());

CREATE POLICY "referrals_admin" ON public.referrals
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin')
  );


-- ============================================================
-- INDEXES — فهارس لتحسين الأداء
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_stores_owner_id        ON public.stores(owner_id);

CREATE TABLE IF NOT EXISTS public.users (
  id                    UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name                  TEXT,
  email                 TEXT UNIQUE NOT NULL,
  phone                 TEXT,
  role                  TEXT NOT NULL DEFAULT 'store_owner' CHECK (role IN ('admin', 'store_owner')),
  status                TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('active', 'pending', 'inactive')),
  wallet_yer            NUMERIC NOT NULL DEFAULT 0,
  referral_code         TEXT UNIQUE,
  pending_wallet_balance NUMERIC NOT NULL DEFAULT 0,
  referred_by           UUID REFERENCES public.users(id) ON DELETE SET NULL,
  last_login            TIMESTAMPTZ,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_select_own" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "users_update_own" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "admin_all_users" ON public.users
  USING (EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin'));


-- ============================================================
-- 1.1 PACKAGES — باقات الاشتراك المتاحة
-- ============================================================
CREATE TABLE IF NOT EXISTS public.packages (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        JSONB NOT NULL, -- {"ar": "...", "en": "...", "zh": "..."}
  description JSONB,
  price       NUMERIC NOT NULL DEFAULT 0,
  category    TEXT NOT NULL CHECK (category IN ('design', 'web', 'store')),
  features    JSONB,
  limits      JSONB NOT NULL DEFAULT '{}'::jsonb, -- e.g., {"max_products": 100, "max_orders": 500}
  is_active   BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "packages_public_read" ON public.packages
  FOR SELECT USING (is_active = true);

CREATE POLICY "admin_all_packages" ON public.packages
  FOR ALL USING (EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin'));

-- Update users table to reference packages
ALTER TABLE public.users ADD COLUMN package_id UUID REFERENCES public.packages(id) ON DELETE SET NULL;


-- ============================================================
-- 1.2 SUBSCRIPTIONS — اشتراكات المستخدمين في الباقات
-- ============================================================
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  package_id      UUID NOT NULL REFERENCES public.packages(id) ON DELETE CASCADE,
  status          TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled')),
  starts_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  ends_at         TIMESTAMPTZ,
  payment_status  TEXT NOT NULL DEFAULT 'paid' CHECK (payment_status IN ('pending', 'paid', 'failed')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "subscriptions_own" ON public.subscriptions
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "admin_all_subscriptions" ON public.subscriptions
  FOR ALL USING (EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin'));


-- ============================================================
-- 2. STORES — المتاجر
-- ============================================================
CREATE TABLE IF NOT EXISTS public.stores (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id      UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  store_name    TEXT NOT NULL,
  store_url     TEXT UNIQUE NOT NULL,
  store_niche   TEXT DEFAULT 'عام',
  logo          TEXT,
  description   TEXT,
  whatsapp      TEXT,
  email_contact TEXT,
  instagram     TEXT,
  facebook      TEXT,
  auto_message  TEXT,
  theme_color   TEXT DEFAULT 'Dark',
  template_id   TEXT,
  is_active     BOOLEAN NOT NULL DEFAULT false,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "store_owner_select" ON public.stores
  FOR SELECT USING (owner_id = auth.uid());

CREATE POLICY "store_owner_modify" ON public.stores
  FOR ALL USING (owner_id = auth.uid());

CREATE POLICY "public_store_select" ON public.stores
  FOR SELECT USING (is_active = true);

CREATE POLICY "admin_all_stores" ON public.stores
  USING (EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin'));


-- ============================================================
-- 3. CATEGORIES — تصنيفات المنتجات
-- ============================================================
CREATE TABLE IF NOT EXISTS public.categories (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id   UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  name       TEXT NOT NULL,
  img        TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "categories_store_owner" ON public.categories
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.stores s WHERE s.id = store_id AND s.owner_id = auth.uid())
  );

CREATE POLICY "categories_public_read" ON public.categories
  FOR SELECT USING (true);


-- ============================================================
-- 4. PRODUCTS — المنتجات
-- ============================================================
CREATE TABLE IF NOT EXISTS public.products (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id       UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  category_id    UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  name           TEXT NOT NULL,
  description    TEXT,
  price          NUMERIC NOT NULL DEFAULT 0,
  discount_price NUMERIC,
  img            TEXT,
  stock          INTEGER DEFAULT 0,
  sales_count    INTEGER NOT NULL DEFAULT 0,
  is_active      BOOLEAN NOT NULL DEFAULT true,
  is_new         BOOLEAN NOT NULL DEFAULT false,
  is_best_seller BOOLEAN NOT NULL DEFAULT false,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "products_store_owner" ON public.products
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.stores s WHERE s.id = store_id AND s.owner_id = auth.uid())
  );

CREATE POLICY "products_public_read" ON public.products
  FOR SELECT USING (is_active = true);


-- ============================================================
-- 5. STORE_CUSTOMERS — عملاء المتاجر
-- ============================================================
CREATE TABLE IF NOT EXISTS public.store_customers (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id    UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  supabase_id UUID,
  name        TEXT NOT NULL,
  email       TEXT,
  phone       TEXT,
  wallet      NUMERIC NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (store_id, email)
);

CREATE TABLE IF NOT EXISTS public.orders (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id         UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  customer_id      UUID REFERENCES public.store_customers(id) ON DELETE SET NULL,
  items            JSONB NOT NULL DEFAULT '[]',
  total            NUMERIC NOT NULL DEFAULT 0,
  discount         NUMERIC NOT NULL DEFAULT 0,
  coupon_code      TEXT,
  status           TEXT NOT NULL DEFAULT 'pending'
                   CHECK (status IN ('pending','processing','shipped','delivered','cancelled')),
  payment_method   TEXT,
  shipping_address JSONB,
  notes            TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.coupons (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id       UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  code           TEXT NOT NULL,
  discount_type  TEXT NOT NULL DEFAULT 'percent' CHECK (discount_type IN ('percent', 'fixed')),
  discount_value NUMERIC NOT NULL DEFAULT 0,
  min_order      NUMERIC DEFAULT 0,
  max_uses       INTEGER,
  used_count     INTEGER NOT NULL DEFAULT 0,
  expires_at     TIMESTAMPTZ,
  is_active      BOOLEAN NOT NULL DEFAULT true,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (store_id, code)
);

ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "coupons_store_owner" ON public.coupons
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.stores s WHERE s.id = store_id AND s.owner_id = auth.uid())
  );

CREATE POLICY "coupons_public_read" ON public.coupons
  FOR SELECT USING (is_active = true);


-- ============================================================
-- 8. BANNERS — البانرات
-- ============================================================
CREATE TABLE IF NOT EXISTS public.banners (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id   UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  img        TEXT NOT NULL,
  title      TEXT,
  link       TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active  BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "banners_store_owner" ON public.banners
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.stores s WHERE s.id = store_id AND s.owner_id = auth.uid())
  );

CREATE POLICY "banners_public_read" ON public.banners
  FOR SELECT USING (is_active = true);


-- ============================================================
-- 9. OFFERS — العروض والخصومات
-- ============================================================
CREATE TABLE IF NOT EXISTS public.offers (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id       UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  product_id     UUID REFERENCES public.products(id) ON DELETE CASCADE,
  category_id    UUID REFERENCES public.categories(id) ON DELETE CASCADE,
  discount_type  TEXT NOT NULL DEFAULT 'percent' CHECK (discount_type IN ('percent', 'fixed')),
  discount_value NUMERIC NOT NULL DEFAULT 0,
  starts_at      TIMESTAMPTZ,
  ends_at        TIMESTAMPTZ,
  is_active      BOOLEAN NOT NULL DEFAULT true,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "offers_store_owner" ON public.offers
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.stores s WHERE s.id = store_id AND s.owner_id = auth.uid())
  );

CREATE POLICY "offers_public_read" ON public.offers
  FOR SELECT USING (is_active = true);


-- ============================================================
-- 10. ADDRESSES — عناوين الشحن للعملاء
-- ============================================================
CREATE TABLE IF NOT EXISTS public.addresses (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES public.store_customers(id) ON DELETE CASCADE,
  full_name   TEXT NOT NULL,
  phone       TEXT NOT NULL,
  city        TEXT NOT NULL,
  area        TEXT NOT NULL,
  details     TEXT NOT NULL,
  notes       TEXT,
  is_default  BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.recharge_requests (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  amount      NUMERIC NOT NULL CHECK (amount > 0),
  status      TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  user_name   TEXT,
  user_email  TEXT,
  receipt_img TEXT,
  notes       TEXT,
  reviewed_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.recharge_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "recharge_requests_own" ON public.recharge_requests
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "recharge_requests_insert_own" ON public.recharge_requests
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "recharge_requests_admin" ON public.recharge_requests
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin')
  );


-- ============================================================
-- 12. WITHDRAWAL_REQUESTS — طلبات السحب (مستخدم → مدير)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.withdrawal_requests (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id        UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  amount         NUMERIC NOT NULL CHECK (amount > 0),
  bank_name      TEXT NOT NULL,
  account_number TEXT NOT NULL,
  account_holder TEXT NOT NULL,
  status         TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  notes          TEXT,
  reviewed_by    UUID REFERENCES public.users(id) ON DELETE SET NULL,
  reviewed_at    TIMESTAMPTZ,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.withdrawal_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "withdrawal_requests_own" ON public.withdrawal_requests
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "withdrawal_requests_insert_own" ON public.withdrawal_requests
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "withdrawal_requests_admin" ON public.withdrawal_requests
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin')
  );


-- ============================================================
-- 13. WALLET_CHARGES — شحن محافظ العملاء (مستخدم → عميل)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.wallet_charges (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id    UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES public.store_customers(id) ON DELETE CASCADE,
  amount      NUMERIC NOT NULL CHECK (amount > 0),
  description TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.transactions (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  amount      NUMERIC NOT NULL,
  type        TEXT NOT NULL
              CHECK (type IN ('recharge','withdrawal','subscription','wallet_charge','referral_reward','transfer')),
  description TEXT,
  ref_id      UUID,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "transactions_own" ON public.transactions
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "transactions_admin" ON public.transactions
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin')
  );


-- ============================================================
-- 15. NOTIFICATIONS — الإشعارات (مع Realtime)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID,
  role       TEXT CHECK (role IN ('user','admin','customer')),
  type       TEXT NOT NULL
             CHECK (type IN ('order','payment','wallet','coupon','system')),
  title      TEXT NOT NULL,
  message    TEXT NOT NULL,
  data       JSONB,
  is_read    BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for fast user lookups
CREATE INDEX IF NOT EXISTS notifications_user_id_idx ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS notifications_role_idx ON public.notifications(role);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "notifications_own" ON public.notifications
  FOR SELECT USING (user_id = auth.uid() OR role IS NOT NULL);

CREATE POLICY "notifications_mark_read" ON public.notifications
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "notifications_delete_own" ON public.notifications
  FOR DELETE USING (user_id = auth.uid());

CREATE POLICY "notifications_insert_admin_or_system" ON public.notifications
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL OR true
  );

-- Enable Realtime on notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;


-- ============================================================
-- 16. NOTIFICATION_LOGS — سجل تنفيذ أوامر الإشعارات
-- ============================================================
CREATE TABLE IF NOT EXISTS public.notification_logs (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  command    TEXT NOT NULL,
  payload    TEXT,
  status     TEXT NOT NULL CHECK (status IN ('success','error')),
  error      TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.notification_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "notification_logs_admin" ON public.notification_logs
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin')
  );


-- ============================================================
-- 17. SUPPORT_MESSAGES — رسائل الدعم الفني
-- ============================================================
CREATE TABLE IF NOT EXISTS public.support_messages (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID REFERENCES public.users(id) ON DELETE SET NULL,
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  subject    TEXT,
  message    TEXT NOT NULL,
  status     TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open','in_progress','resolved')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.support_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "support_messages_own" ON public.support_messages
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "support_messages_insert" ON public.support_messages
  FOR INSERT WITH CHECK (true);

CREATE POLICY "support_messages_admin" ON public.support_messages
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin')
  );


-- ============================================================
-- 18. REFERRALS — نظام الإحالة والتسويق بالعمولة
-- ============================================================
CREATE TABLE IF NOT EXISTS public.referrals (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  referrer_id         UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  referred_user_id    UUID REFERENCES public.users(id) ON DELETE SET NULL,
  referral_code       TEXT NOT NULL,
  status              TEXT NOT NULL DEFAULT 'pending'
                      CHECK (status IN ('pending','subscribed','rewarded')),
  reward_amount       NUMERIC NOT NULL DEFAULT 0,
  reward_paid         BOOLEAN NOT NULL DEFAULT false,
  subscription_ref_id UUID,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "referrals_own" ON public.referrals
  FOR SELECT USING (referrer_id = auth.uid());

CREATE POLICY "referrals_admin" ON public.referrals
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin')
  );


-- ============================================================
-- INDEXES — فهارس لتحسين الأداء
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_stores_owner_id        ON public.stores(owner_id);
CREATE INDEX IF NOT EXISTS idx_products_store_id      ON public.products(store_id);
CREATE INDEX IF NOT EXISTS idx_products_category_id   ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_orders_store_id        ON public.orders(store_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id     ON public.orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_store_customers_store  ON public.store_customers(store_id);

CREATE TABLE IF NOT EXISTS public.users (
  id                    UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name                  TEXT,
  email                 TEXT UNIQUE NOT NULL,
  phone                 TEXT,
  role                  TEXT NOT NULL DEFAULT 'store_owner' CHECK (role IN ('admin', 'store_owner')),
  status                TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('active', 'pending', 'inactive')),
  wallet_yer            NUMERIC NOT NULL DEFAULT 0,
  referral_code         TEXT UNIQUE,
  pending_wallet_balance NUMERIC NOT NULL DEFAULT 0,
  referred_by           UUID REFERENCES public.users(id) ON DELETE SET NULL,
  last_login            TIMESTAMPTZ,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_select_own" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "users_update_own" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "admin_all_users" ON public.users
  USING (EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin'));


-- ============================================================
-- 1.1 PACKAGES — باقات الاشتراك المتاحة
-- ============================================================
CREATE TABLE IF NOT EXISTS public.packages (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        JSONB NOT NULL, -- {"ar": "...", "en": "...", "zh": "..."}
  description JSONB,
  price       NUMERIC NOT NULL DEFAULT 0,
  category    TEXT NOT NULL CHECK (category IN ('design', 'web', 'store')),
  features    JSONB,
  limits      JSONB NOT NULL DEFAULT '{}'::jsonb, -- e.g., {"max_products": 100, "max_orders": 500}
  is_active   BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "packages_public_read" ON public.packages
  FOR SELECT USING (is_active = true);

CREATE POLICY "admin_all_packages" ON public.packages
  FOR ALL USING (EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin'));

-- Update users table to reference packages
ALTER TABLE public.users ADD COLUMN package_id UUID REFERENCES public.packages(id) ON DELETE SET NULL;


-- ============================================================
-- 1.2 SUBSCRIPTIONS — اشتراكات المستخدمين في الباقات
-- ============================================================
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  package_id      UUID NOT NULL REFERENCES public.packages(id) ON DELETE CASCADE,
  status          TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled')),
  starts_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  ends_at         TIMESTAMPTZ,
  payment_status  TEXT NOT NULL DEFAULT 'paid' CHECK (payment_status IN ('pending', 'paid', 'failed')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "subscriptions_own" ON public.subscriptions
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "admin_all_subscriptions" ON public.subscriptions
  FOR ALL USING (EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin'));


-- ============================================================
-- 2. STORES — المتاجر
-- ============================================================
CREATE TABLE IF NOT EXISTS public.stores (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id      UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  store_name    TEXT NOT NULL,
  store_url     TEXT UNIQUE NOT NULL,
  store_niche   TEXT DEFAULT 'عام',
  logo          TEXT,
  description   TEXT,
  whatsapp      TEXT,
  email_contact TEXT,
  instagram     TEXT,
  facebook      TEXT,
  auto_message  TEXT,
  theme_color   TEXT DEFAULT 'Dark',
  template_id   TEXT,
  is_active     BOOLEAN NOT NULL DEFAULT false,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "store_owner_select" ON public.stores
  FOR SELECT USING (owner_id = auth.uid());

CREATE POLICY "store_owner_modify" ON public.stores
  FOR ALL USING (owner_id = auth.uid());

CREATE POLICY "public_store_select" ON public.stores
  FOR SELECT USING (is_active = true);

CREATE POLICY "admin_all_stores" ON public.stores
  USING (EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin'));


-- ============================================================
-- 3. CATEGORIES — تصنيفات المنتجات
-- ============================================================
CREATE TABLE IF NOT EXISTS public.categories (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id   UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  name       TEXT NOT NULL,
  img        TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "categories_store_owner" ON public.categories
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.stores s WHERE s.id = store_id AND s.owner_id = auth.uid())
  );

CREATE POLICY "categories_public_read" ON public.categories
  FOR SELECT USING (true);


-- ============================================================
-- 4. PRODUCTS — المنتجات
-- ============================================================
CREATE TABLE IF NOT EXISTS public.products (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id       UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  category_id    UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  name           TEXT NOT NULL,
  description    TEXT,
  price          NUMERIC NOT NULL DEFAULT 0,
  discount_price NUMERIC,
  img            TEXT,
  stock          INTEGER DEFAULT 0,
  sales_count    INTEGER NOT NULL DEFAULT 0,
  is_active      BOOLEAN NOT NULL DEFAULT true,
  is_new         BOOLEAN NOT NULL DEFAULT false,
  is_best_seller BOOLEAN NOT NULL DEFAULT false,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.store_customers (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id    UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  supabase_id UUID,
  name        TEXT NOT NULL,
  email       TEXT,
  phone       TEXT,
  wallet      NUMERIC NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (store_id, email)
);

ALTER TABLE public.store_customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "store_customers_owner" ON public.store_customers
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.stores s WHERE s.id = store_id AND s.owner_id = auth.uid())
  );

CREATE POLICY "store_customers_self" ON public.store_customers
  FOR SELECT USING (supabase_id = auth.uid());


-- ============================================================
-- 6. ORDERS — الطلبات
-- ============================================================
CREATE TABLE IF NOT EXISTS public.orders (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id         UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  customer_id      UUID REFERENCES public.store_customers(id) ON DELETE SET NULL,
  items            JSONB NOT NULL DEFAULT '[]',
  total            NUMERIC NOT NULL DEFAULT 0,
  discount         NUMERIC NOT NULL DEFAULT 0,
  coupon_code      TEXT,
  status           TEXT NOT NULL DEFAULT 'pending'
                   CHECK (status IN ('pending','processing','shipped','delivered','cancelled')),
  payment_method   TEXT,
  shipping_address JSONB,
  notes            TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "orders_store_owner" ON public.orders
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.stores s WHERE s.id = store_id AND s.owner_id = auth.uid())
  );

CREATE POLICY "orders_customer_self" ON public.orders
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.store_customers sc WHERE sc.id = customer_id AND sc.supabase_id = auth.uid())
  );


-- ============================================================
-- 7. COUPONS — الكوبونات
-- ============================================================
CREATE TABLE IF NOT EXISTS public.coupons (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id       UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  code           TEXT NOT NULL,
  discount_type  TEXT NOT NULL DEFAULT 'percent' CHECK (discount_type IN ('percent', 'fixed')),
  discount_value NUMERIC NOT NULL DEFAULT 0,
  min_order      NUMERIC DEFAULT 0,
  max_uses       INTEGER,
  used_count     INTEGER NOT NULL DEFAULT 0,
  expires_at     TIMESTAMPTZ,
  is_active      BOOLEAN NOT NULL DEFAULT true,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (store_id, code)
);

ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "coupons_store_owner" ON public.coupons
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.stores s WHERE s.id = store_id AND s.owner_id = auth.uid())
  );

CREATE POLICY "coupons_public_read" ON public.coupons
  FOR SELECT USING (is_active = true);


-- ============================================================
-- 8. BANNERS — البانرات
-- ============================================================
CREATE TABLE IF NOT EXISTS public.banners (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id   UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  img        TEXT NOT NULL,
  title      TEXT,
  link       TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active  BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "banners_store_owner" ON public.banners
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.stores s WHERE s.id = store_id AND s.owner_id = auth.uid())
  );

CREATE POLICY "banners_public_read" ON public.banners
  FOR SELECT USING (is_active = true);


-- ============================================================
-- 9. OFFERS — العروض والخصومات
-- ============================================================
CREATE TABLE IF NOT EXISTS public.offers (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id       UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  product_id     UUID REFERENCES public.products(id) ON DELETE CASCADE,
  category_id    UUID REFERENCES public.categories(id) ON DELETE CASCADE,
  discount_type  TEXT NOT NULL DEFAULT 'percent' CHECK (discount_type IN ('percent', 'fixed')),
  discount_value NUMERIC NOT NULL DEFAULT 0,
  starts_at      TIMESTAMPTZ,
  ends_at        TIMESTAMPTZ,
  is_active      BOOLEAN NOT NULL DEFAULT true,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.addresses (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES public.store_customers(id) ON DELETE CASCADE,
  full_name   TEXT NOT NULL,
  phone       TEXT NOT NULL,
  city        TEXT NOT NULL,
  area        TEXT NOT NULL,
  details     TEXT NOT NULL,
  notes       TEXT,
  is_default  BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "addresses_customer_self" ON public.addresses
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.store_customers sc WHERE sc.id = customer_id AND sc.supabase_id = auth.uid())
  );

CREATE POLICY "addresses_store_owner" ON public.addresses
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.store_customers sc
      JOIN public.stores s ON s.id = sc.store_id
      WHERE sc.id = customer_id AND s.owner_id = auth.uid()
    )
  );


-- ============================================================
-- 11. RECHARGE_REQUESTS — طلبات شحن المحفظة (مستخدم → مدير)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.recharge_requests (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  amount      NUMERIC NOT NULL CHECK (amount > 0),
  status      TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  user_name   TEXT,
  user_email  TEXT,
  receipt_img TEXT,
  notes       TEXT,
  reviewed_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.recharge_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "recharge_requests_own" ON public.recharge_requests
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "recharge_requests_insert_own" ON public.recharge_requests
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "recharge_requests_admin" ON public.recharge_requests
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin')
  );


-- ============================================================
-- 12. WITHDRAWAL_REQUESTS — طلبات السحب (مستخدم → مدير)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.withdrawal_requests (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id        UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  amount         NUMERIC NOT NULL CHECK (amount > 0),
  bank_name      TEXT NOT NULL,
  account_number TEXT NOT NULL,
  account_holder TEXT NOT NULL,
  status         TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  notes          TEXT,
  reviewed_by    UUID REFERENCES public.users(id) ON DELETE SET NULL,
  reviewed_at    TIMESTAMPTZ,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.withdrawal_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "withdrawal_requests_own" ON public.withdrawal_requests
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "withdrawal_requests_insert_own" ON public.withdrawal_requests
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "withdrawal_requests_admin" ON public.withdrawal_requests
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin')
  );


-- ============================================================
-- 13. WALLET_CHARGES — شحن محافظ العملاء (مستخدم → عميل)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.wallet_charges (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id    UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES public.store_customers(id) ON DELETE CASCADE,
  amount      NUMERIC NOT NULL CHECK (amount > 0),
  description TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.wallet_charges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "wallet_charges_store_owner" ON public.wallet_charges
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "wallet_charges_admin" ON public.wallet_charges
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin')
  );


-- ============================================================
-- 14. TRANSACTIONS — سجل المعاملات المالية
-- ============================================================
CREATE TABLE IF NOT EXISTS public.transactions (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  amount      NUMERIC NOT NULL,
  type        TEXT NOT NULL
              CHECK (type IN ('recharge','withdrawal','subscription','wallet_charge','referral_reward','transfer')),
  description TEXT,
  ref_id      UUID,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "transactions_own" ON public.transactions
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "transactions_admin" ON public.transactions
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin')
  );


-- ============================================================
-- 15. NOTIFICATIONS — الإشعارات (مع Realtime)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID,
  role       TEXT CHECK (role IN ('user','admin','customer')),
  type       TEXT NOT NULL
             CHECK (type IN ('order','payment','wallet','coupon','system')),
  title      TEXT NOT NULL,
  message    TEXT NOT NULL,
  data       JSONB,
  is_read    BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for fast user lookups
CREATE INDEX IF NOT EXISTS notifications_user_id_idx ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS notifications_role_idx ON public.notifications(role);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "notifications_own" ON public.notifications
  FOR SELECT USING (user_id = auth.uid() OR role IS NOT NULL);

CREATE POLICY "notifications_mark_read" ON public.notifications
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "notifications_delete_own" ON public.notifications
  FOR DELETE USING (user_id = auth.uid());

CREATE POLICY "notifications_insert_admin_or_system" ON public.notifications
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL OR true
  );

-- Enable Realtime on notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;


-- ============================================================
-- 16. NOTIFICATION_LOGS — سجل تنفيذ أوامر الإشعارات
-- ============================================================
CREATE TABLE IF NOT EXISTS public.notification_logs (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  command    TEXT NOT NULL,
  payload    TEXT,
  status     TEXT NOT NULL CHECK (status IN ('success','error')),
  error      TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.notification_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "notification_logs_admin" ON public.notification_logs
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin')
  );


-- ============================================================
-- 17. SUPPORT_MESSAGES — رسائل الدعم الفني
-- ============================================================
CREATE TABLE IF NOT EXISTS public.support_messages (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID REFERENCES public.users(id) ON DELETE SET NULL,
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  subject    TEXT,
  message    TEXT NOT NULL,
  status     TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open','in_progress','resolved')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.support_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "support_messages_own" ON public.support_messages
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "support_messages_insert" ON public.support_messages
  FOR INSERT WITH CHECK (true);

CREATE POLICY "support_messages_admin" ON public.support_messages
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin')
  );


-- ============================================================
-- 18. REFERRALS — نظام الإحالة والتسويق بالعمولة
-- ============================================================
CREATE TABLE IF NOT EXISTS public.referrals (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  referrer_id         UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  referred_user_id    UUID REFERENCES public.users(id) ON DELETE SET NULL,
  referral_code       TEXT NOT NULL,
  status              TEXT NOT NULL DEFAULT 'pending'
                      CHECK (status IN ('pending','subscribed','rewarded')),
  reward_amount       NUMERIC NOT NULL DEFAULT 0,
  reward_paid         BOOLEAN NOT NULL DEFAULT false,
  subscription_ref_id UUID,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "referrals_own" ON public.referrals
  FOR SELECT USING (referrer_id = auth.uid());

CREATE POLICY "referrals_admin" ON public.referrals
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin')
  );


-- ============================================================
-- INDEXES — فهارس لتحسين الأداء
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_stores_owner_id        ON public.stores(owner_id);
CREATE INDEX IF NOT EXISTS idx_products_store_id      ON public.products(store_id);

CREATE TABLE IF NOT EXISTS public.users (
  id                    UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name                  TEXT,
  email                 TEXT UNIQUE NOT NULL,
  phone                 TEXT,
  role                  TEXT NOT NULL DEFAULT 'store_owner' CHECK (role IN ('admin', 'store_owner')),
  status                TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('active', 'pending', 'inactive')),
  wallet_yer            NUMERIC NOT NULL DEFAULT 0,
  referral_code         TEXT UNIQUE,
  pending_wallet_balance NUMERIC NOT NULL DEFAULT 0,
  referred_by           UUID REFERENCES public.users(id) ON DELETE SET NULL,
  last_login            TIMESTAMPTZ,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.packages (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        JSONB NOT NULL, -- {"ar": "...", "en": "...", "zh": "..."}
  description JSONB,
  price       NUMERIC NOT NULL DEFAULT 0,
  category    TEXT NOT NULL CHECK (category IN ('design', 'web', 'store')),
  features    JSONB,
  limits      JSONB NOT NULL DEFAULT '{}'::jsonb, -- e.g., {"max_products": 100, "max_orders": 500}
  is_active   BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "packages_public_read" ON public.packages
  FOR SELECT USING (is_active = true);

CREATE POLICY "admin_all_packages" ON public.packages
  FOR ALL USING (EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin'));

CREATE TABLE IF NOT EXISTS public.subscriptions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  package_id      UUID NOT NULL REFERENCES public.packages(id) ON DELETE CASCADE,
  status          TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled')),
  starts_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  ends_at         TIMESTAMPTZ,
  payment_status  TEXT NOT NULL DEFAULT 'paid' CHECK (payment_status IN ('pending', 'paid', 'failed')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.stores (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id      UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  store_name    TEXT NOT NULL,
  store_url     TEXT UNIQUE NOT NULL,
  store_niche   TEXT DEFAULT 'عام',
  logo          TEXT,
  description   TEXT,
  whatsapp      TEXT,
  email_contact TEXT,
  instagram     TEXT,
  facebook      TEXT,
  auto_message  TEXT,
  theme_color   TEXT DEFAULT 'Dark',
  template_id   TEXT,
  is_active     BOOLEAN NOT NULL DEFAULT false,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.categories (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id   UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  name       TEXT NOT NULL,
  img        TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "categories_store_owner" ON public.categories
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.stores s WHERE s.id = store_id AND s.owner_id = auth.uid())
  );

CREATE POLICY "categories_public_read" ON public.categories
  FOR SELECT USING (true);


-- ============================================================
-- 4. PRODUCTS — المنتجات
-- ============================================================
CREATE TABLE IF NOT EXISTS public.products (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id       UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  category_id    UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  name           TEXT NOT NULL,
  description    TEXT,
  price          NUMERIC NOT NULL DEFAULT 0,
  discount_price NUMERIC,
  img            TEXT,
  stock          INTEGER DEFAULT 0,
  sales_count    INTEGER NOT NULL DEFAULT 0,
  is_active      BOOLEAN NOT NULL DEFAULT true,
  is_new         BOOLEAN NOT NULL DEFAULT false,
  is_best_seller BOOLEAN NOT NULL DEFAULT false,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "products_store_owner" ON public.products
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.stores s WHERE s.id = store_id AND s.owner_id = auth.uid())
  );

CREATE POLICY "products_public_read" ON public.products
  FOR SELECT USING (is_active = true);


-- ============================================================
-- 5. STORE_CUSTOMERS — عملاء المتاجر
-- ============================================================
CREATE TABLE IF NOT EXISTS public.store_customers (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id    UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  supabase_id UUID,
  name        TEXT NOT NULL,
  email       TEXT,
  phone       TEXT,
  wallet      NUMERIC NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (store_id, email)
);

ALTER TABLE public.store_customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "store_customers_owner" ON public.store_customers
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.stores s WHERE s.id = store_id AND s.owner_id = auth.uid())
  );

CREATE POLICY "store_customers_self" ON public.store_customers
  FOR SELECT USING (supabase_id = auth.uid());


-- ============================================================
-- 6. ORDERS — الطلبات
-- ============================================================
CREATE TABLE IF NOT EXISTS public.orders (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id         UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  customer_id      UUID REFERENCES public.store_customers(id) ON DELETE SET NULL,
  items            JSONB NOT NULL DEFAULT '[]',
  total            NUMERIC NOT NULL DEFAULT 0,
  discount         NUMERIC NOT NULL DEFAULT 0,
  coupon_code      TEXT,
  status           TEXT NOT NULL DEFAULT 'pending'
                   CHECK (status IN ('pending','processing','shipped','delivered','cancelled')),
  payment_method   TEXT,
  shipping_address JSONB,
  notes            TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "orders_store_owner" ON public.orders
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.stores s WHERE s.id = store_id AND s.owner_id = auth.uid())
  );

CREATE POLICY "orders_customer_self" ON public.orders
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.store_customers sc WHERE sc.id = customer_id AND sc.supabase_id = auth.uid())
  );


-- ============================================================
-- 7. COUPONS — الكوبونات
-- ============================================================
CREATE TABLE IF NOT EXISTS public.coupons (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id       UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  code           TEXT NOT NULL,
  discount_type  TEXT NOT NULL DEFAULT 'percent' CHECK (discount_type IN ('percent', 'fixed')),
  discount_value NUMERIC NOT NULL DEFAULT 0,
  min_order      NUMERIC DEFAULT 0,
  max_uses       INTEGER,
  used_count     INTEGER NOT NULL DEFAULT 0,
  expires_at     TIMESTAMPTZ,
  is_active      BOOLEAN NOT NULL DEFAULT true,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (store_id, code)
);

ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "coupons_store_owner" ON public.coupons
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.stores s WHERE s.id = store_id AND s.owner_id = auth.uid())
  );

CREATE POLICY "coupons_public_read" ON public.coupons
  FOR SELECT USING (is_active = true);


-- ============================================================
-- 8. BANNERS — البانرات
-- ============================================================
CREATE TABLE IF NOT EXISTS public.banners (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id   UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  img        TEXT NOT NULL,
  title      TEXT,
  link       TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active  BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "banners_store_owner" ON public.banners
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.stores s WHERE s.id = store_id AND s.owner_id = auth.uid())
  );

CREATE POLICY "banners_public_read" ON public.banners
  FOR SELECT USING (is_active = true);


-- ============================================================
-- 9. OFFERS — العروض والخصومات
-- ============================================================
CREATE TABLE IF NOT EXISTS public.offers (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id       UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  product_id     UUID REFERENCES public.products(id) ON DELETE CASCADE,
  category_id    UUID REFERENCES public.categories(id) ON DELETE CASCADE,
  discount_type  TEXT NOT NULL DEFAULT 'percent' CHECK (discount_type IN ('percent', 'fixed')),
  discount_value NUMERIC NOT NULL DEFAULT 0,
  starts_at      TIMESTAMPTZ,
  ends_at        TIMESTAMPTZ,
  is_active      BOOLEAN NOT NULL DEFAULT true,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "offers_store_owner" ON public.offers
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.stores s WHERE s.id = store_id AND s.owner_id = auth.uid())
  );

CREATE POLICY "offers_public_read" ON public.offers
  FOR SELECT USING (is_active = true);


-- ============================================================
-- 10. ADDRESSES — عناوين الشحن للعملاء
-- ============================================================
CREATE TABLE IF NOT EXISTS public.addresses (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES public.store_customers(id) ON DELETE CASCADE,
  full_name   TEXT NOT NULL,
  phone       TEXT NOT NULL,
  city        TEXT NOT NULL,
  area        TEXT NOT NULL,
  details     TEXT NOT NULL,
  notes       TEXT,
  is_default  BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "addresses_customer_self" ON public.addresses
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.store_customers sc WHERE sc.id = customer_id AND sc.supabase_id = auth.uid())
  );

CREATE POLICY "addresses_store_owner" ON public.addresses
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.store_customers sc
      JOIN public.stores s ON s.id = sc.store_id
      WHERE sc.id = customer_id AND s.owner_id = auth.uid()
    )
  );


-- ============================================================
-- 11. RECHARGE_REQUESTS — طلبات شحن المحفظة (مستخدم → مدير)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.recharge_requests (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  amount      NUMERIC NOT NULL CHECK (amount > 0),
  status      TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  user_name   TEXT,
  user_email  TEXT,
  receipt_img TEXT,
  notes       TEXT,
  reviewed_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.withdrawal_requests (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id        UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  amount         NUMERIC NOT NULL CHECK (amount > 0),
  bank_name      TEXT NOT NULL,
  account_number TEXT NOT NULL,
  account_holder TEXT NOT NULL,
  status         TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  notes          TEXT,
  reviewed_by    UUID REFERENCES public.users(id) ON DELETE SET NULL,
  reviewed_at    TIMESTAMPTZ,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.wallet_charges (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id    UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES public.store_customers(id) ON DELETE CASCADE,
  amount      NUMERIC NOT NULL CHECK (amount > 0),
  description TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.transactions (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  amount      NUMERIC NOT NULL,
  type        TEXT NOT NULL
              CHECK (type IN ('recharge','withdrawal','subscription','wallet_charge','referral_reward','transfer')),
  description TEXT,
  ref_id      UUID,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.notifications (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID,
  role       TEXT CHECK (role IN ('user','admin','customer')),
  type       TEXT NOT NULL
             CHECK (type IN ('order','payment','wallet','coupon','system')),
  title      TEXT NOT NULL,
  message    TEXT NOT NULL,
  data       JSONB,
  is_read    BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for fast user lookups
CREATE INDEX IF NOT EXISTS notifications_user_id_idx ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS notifications_role_idx ON public.notifications(role);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "notifications_own" ON public.notifications
  FOR SELECT USING (user_id = auth.uid() OR role IS NOT NULL);

CREATE POLICY "notifications_mark_read" ON public.notifications
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "notifications_delete_own" ON public.notifications
  FOR DELETE USING (user_id = auth.uid());

CREATE POLICY "notifications_insert_admin_or_system" ON public.notifications
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL OR true
  );

-- Enable Realtime on notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;


-- ============================================================
-- 16. NOTIFICATION_LOGS — سجل تنفيذ أوامر الإشعارات
-- ============================================================
CREATE TABLE IF NOT EXISTS public.notification_logs (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  command    TEXT NOT NULL,
  payload    TEXT,
  status     TEXT NOT NULL CHECK (status IN ('success','error')),
  error      TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.notification_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "notification_logs_admin" ON public.notification_logs
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin')
  );

CREATE TABLE IF NOT EXISTS public.support_messages (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID REFERENCES public.users(id) ON DELETE SET NULL,
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  subject    TEXT,
  message    TEXT NOT NULL,
  status     TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open','in_progress','resolved')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.referrals (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  referrer_id         UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  referred_user_id    UUID REFERENCES public.users(id) ON DELETE SET NULL,
  referral_code       TEXT NOT NULL,
  status              TEXT NOT NULL DEFAULT 'pending'
                      CHECK (status IN ('pending','subscribed','rewarded')),
  reward_amount       NUMERIC NOT NULL DEFAULT 0,
  reward_paid         BOOLEAN NOT NULL DEFAULT false,
  subscription_ref_id UUID,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

