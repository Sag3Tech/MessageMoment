import SessionModel from "../models/session-model";

export const UpdateSessionDuration = (sessionId: string) => {
  setInterval(async () => {
    const session = await SessionModel.findOne({ sessionId });

    if (session && session.isActive) {
      const currentDuration = Math.floor(
        (Date.now() - session.createdAt.getTime()) / 1000
      );
      session.realTimeDuration = currentDuration;
      await session.save();
    }
  }, 1000);
};
