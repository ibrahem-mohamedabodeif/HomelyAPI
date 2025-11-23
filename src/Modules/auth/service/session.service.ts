import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { Session } from '../entity/session.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class SessionService {
  constructor(
    @InjectModel(Session.name) private sessionModel: Model<Session>,
  ) {}
  async createSession(data: {
    userId: string;
    refreshToken?: string;
    deviceInfo?: string;
    ipAddress?: string;
    durationDays?: number;
  }) {
    const hashedToken = await bcrypt.hash(data.refreshToken ?? '', 10);
    const expiredAt = new Date(
      Date.now() + (data.durationDays ?? 7 * 24 * 60 * 60 * 1000),
    );
    const session = await this.sessionModel.create({
      userId: data.userId,
      refreshToken: hashedToken,
      deviceInfo: data.deviceInfo ?? 'Unknown',
      ipAddress: data.ipAddress ?? 'Unknown',
      expiredAt,
    });

    return session;
  }

  async validateRefreshToken(sessionId: string, presentedToken: string) {
    const session = await this.sessionModel
      .findById(sessionId)
      .select('+refreshToken')
      .lean();
    if (!session) return false;
    return bcrypt.compare(presentedToken, session.refreshToken);
  }

  async updateRefreshToken(
    sessionId: string,
    newRefreshToken: string,
    durationDays = 7,
  ) {
    const hashed = await bcrypt.hash(newRefreshToken, 10);
    const expiredAt = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000);
    return this.sessionModel.findByIdAndUpdate(
      sessionId,
      { refreshToken: hashed, expiredAt },
      { new: true },
    );
  }

  async findSessionByUserId(userId: string) {
    const sessions = await this.sessionModel.find({ userId }).exec();
    return sessions;
  }

  async deleteSessionById(sessionId: string) {
    return this.sessionModel.findByIdAndDelete(sessionId);
  }

  async findSessionById(sessionId: string) {
    return this.sessionModel.findById(sessionId).exec();
  }
}
