-- CreateTable
CREATE TABLE "public"."refresh_tokens" (
    "id" TEXT NOT NULL,
    "jti" TEXT NOT NULL,
    "family_id" TEXT NOT NULL,
    "subject_user_id" TEXT NOT NULL,
    "subject_type" TEXT NOT NULL,
    "issued_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "rotated_at" TIMESTAMP(3),
    "revoked_at" TIMESTAMP(3),
    "revoked_reason" TEXT,
    "last_ip" TEXT,
    "last_user_agent" TEXT,
    "last_device_fingerprint" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."sessions" (
    "id" TEXT NOT NULL,
    "session_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "user_type" TEXT NOT NULL,
    "last_seen_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "idle_timeout_at" TIMESTAMP(3) NOT NULL,
    "ip" TEXT,
    "user_agent" TEXT,
    "device_fingerprint" TEXT,
    "revoked_at" TIMESTAMP(3),
    "revoked_reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."auth_audit_logs" (
    "id" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "occurred_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actor_type" TEXT NOT NULL,
    "actor_id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "result" TEXT NOT NULL,
    "ip" TEXT,
    "user_agent" TEXT,
    "token_jti" TEXT,
    "session_id" TEXT,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "auth_audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."revoked_access_tokens" (
    "id" TEXT NOT NULL,
    "jti" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "revoked_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revoked_reason" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "revoked_access_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_jti_key" ON "public"."refresh_tokens"("jti");

-- CreateIndex
CREATE INDEX "refresh_tokens_family_id_idx" ON "public"."refresh_tokens"("family_id");

-- CreateIndex
CREATE INDEX "refresh_tokens_subject_user_id_subject_type_idx" ON "public"."refresh_tokens"("subject_user_id", "subject_type");

-- CreateIndex
CREATE INDEX "refresh_tokens_expires_at_idx" ON "public"."refresh_tokens"("expires_at");

-- CreateIndex
CREATE INDEX "refresh_tokens_revoked_at_idx" ON "public"."refresh_tokens"("revoked_at");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_session_id_key" ON "public"."sessions"("session_id");

-- CreateIndex
CREATE INDEX "sessions_user_id_user_type_idx" ON "public"."sessions"("user_id", "user_type");

-- CreateIndex
CREATE INDEX "sessions_expires_at_idx" ON "public"."sessions"("expires_at");

-- CreateIndex
CREATE INDEX "sessions_idle_timeout_at_idx" ON "public"."sessions"("idle_timeout_at");

-- CreateIndex
CREATE INDEX "sessions_revoked_at_idx" ON "public"."sessions"("revoked_at");

-- CreateIndex
CREATE UNIQUE INDEX "auth_audit_logs_event_id_key" ON "public"."auth_audit_logs"("event_id");

-- CreateIndex
CREATE INDEX "auth_audit_logs_actor_type_actor_id_idx" ON "public"."auth_audit_logs"("actor_type", "actor_id");

-- CreateIndex
CREATE INDEX "auth_audit_logs_action_idx" ON "public"."auth_audit_logs"("action");

-- CreateIndex
CREATE INDEX "auth_audit_logs_occurred_at_idx" ON "public"."auth_audit_logs"("occurred_at");

-- CreateIndex
CREATE INDEX "auth_audit_logs_token_jti_idx" ON "public"."auth_audit_logs"("token_jti");

-- CreateIndex
CREATE INDEX "auth_audit_logs_session_id_idx" ON "public"."auth_audit_logs"("session_id");

-- CreateIndex
CREATE UNIQUE INDEX "revoked_access_tokens_jti_key" ON "public"."revoked_access_tokens"("jti");

-- CreateIndex
CREATE INDEX "revoked_access_tokens_expires_at_idx" ON "public"."revoked_access_tokens"("expires_at");
