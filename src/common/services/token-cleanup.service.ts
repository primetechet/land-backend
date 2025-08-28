import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { RefreshTokenService } from './refresh-token.service';

@Injectable()
export class TokenCleanupService {
  private readonly logger = new Logger(TokenCleanupService.name);

  constructor(private readonly refreshTokenService: RefreshTokenService) {}

  /**
   * Clean up expired refresh tokens every hour
   */
  @Cron(CronExpression.EVERY_HOUR)
  async cleanupExpiredRefreshTokens() {
    try {
      const deletedCount =
        await this.refreshTokenService.cleanupExpiredTokens();
      if (deletedCount > 0) {
        this.logger.log(`Cleaned up ${deletedCount} expired refresh tokens`);
      }
    } catch (error) {
      this.logger.error('Failed to cleanup expired refresh tokens:', error);
    }
  }

  /**
   * Clean up expired revoked access tokens every 30 minutes
   */
  @Cron('0 */30 * * * *') // Every 30 minutes
  async cleanupExpiredRevokedAccessTokens() {
    try {
      const deletedCount =
        await this.refreshTokenService.cleanupRevokedAccessTokens();
      if (deletedCount > 0) {
        this.logger.log(
          `Cleaned up ${deletedCount} expired revoked access tokens`,
        );
      }
    } catch (error) {
      this.logger.error(
        'Failed to cleanup expired revoked access tokens:',
        error,
      );
    }
  }

  /**
   * Clean up expired sessions every 15 minutes
   */
  @Cron('0 */15 * * * *') // Every 15 minutes
  async cleanupExpiredSessions() {
    try {
      const deletedCount =
        await this.refreshTokenService.cleanupExpiredSessions();
      if (deletedCount > 0) {
        this.logger.log(`Cleaned up ${deletedCount} expired sessions`);
      }
    } catch (error) {
      this.logger.error('Failed to cleanup expired sessions:', error);
    }
  }

  /**
   * Clean up old audit logs (older than 90 days) daily at 2 AM
   */
  @Cron('0 2 * * *') // Daily at 2 AM
  async cleanupOldAuditLogs() {
    try {
      // This would be implemented in the RefreshTokenService
      // For now, we'll just log that this is a placeholder
      this.logger.log('Audit log cleanup placeholder - implement as needed');
    } catch (error) {
      this.logger.error('Failed to cleanup old audit logs:', error);
    }
  }
}
