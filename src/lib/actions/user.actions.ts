"use server";

import { revalidatePath } from "next/cache";
import UserModel from "../database/models/user.model";
import { connectToDatabase } from "../database/mongoose";
import { handleError } from "../utils";

// Create a new user
export const createUser = async (user: CreateUserParams) => {
  try {
    await connectToDatabase();
    const newUser = await UserModel.create(user);
    return JSON.parse(JSON.stringify(newUser));
  } catch (error) {
    handleError(error);
  }
};

// Get a user by userId
export const getUserById = async (userId: string) => {
  try {
    await connectToDatabase();
    const user = await UserModel.findOne({ clerkId: userId });
    if (!user) throw new Error("User not found");
    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    handleError(error);
  }
};

// Update a user by userId
export const updateUser = async (clerkId: string, user: UpdateUserParams) => {
  try {
    await connectToDatabase();
    const updatedUser = await UserModel.findOneAndUpdate({ clerkId }, user, {
      new: true,
    });
    if (!updatedUser) throw new Error("User update failed");
    return JSON.parse(JSON.stringify(updatedUser));
  } catch (error) {
    handleError(error);
  }
};

// Delete a user by userId
export const deleteUser = async (clerkId: string) => {
  try {
    await connectToDatabase();
    // Find user to delete
    const userToDelete = await UserModel.findOne({ clerkId });
    if (!userToDelete) throw new Error("User not found");

    // Delete user
    const deletedUser = await UserModel.findByIdAndDelete(userToDelete._id);
    revalidatePath("/");

    return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) : null;
  } catch (error) {
    handleError(error);
  }
};

// Update Credits
export const updateCredits = async (userId: string, creditFee: number) => {
  try {
    await connectToDatabase();
    const updatedUserCredits = await UserModel.findOneAndUpdate(
      { _id: userId },
      { $inc: { creditBalance: creditFee } },
      { new: true }
    );
    if (!updatedUserCredits) throw new Error("User credits update failed");
    return JSON.parse(JSON.stringify(updatedUserCredits));
  } catch (error) {
    handleError(error);
  }
};
