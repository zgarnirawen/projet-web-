import { getDB } from "../dal/database";
import { IUser, USER_COLLECTION } from "../models/user.model";
import { ObjectId } from "mongodb";

export class UserService {
  private collection() {
    return getDB().collection<IUser>(USER_COLLECTION);
  }

  async findByEmail(email: string) {
    return this.collection().findOne({ email });
  }

  async findByGoogleId(googleId: string) {
    return this.collection().findOne({ googleId });
  }

  async create(userData: Partial<IUser>) {
    const user: IUser = {
      email: userData.email!,
      name: userData.name!,
      password: userData.password,
      provider: userData.provider || 'local',
      googleId: userData.googleId,
      role: userData.role || 'USER',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await this.collection().insertOne(user);
    return { ...user, _id: result.insertedId.toString() };
  }

  async updateGoogleId(email: string, googleId: string) {
    await this.collection().updateOne(
      { email },
      { $set: { googleId, updatedAt: new Date() } }
    );
  }
}
