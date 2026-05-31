import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SocialState {
  likedPostIds: Record<string, true>;
  followedUserIds: Record<string, true>;
  togglePostLike: (postId: string) => void;
  toggleFollow: (userId: string) => void;
}

export const useSocialStore = create<SocialState>()(
  persist(
    (set) => ({
      likedPostIds: {},
      followedUserIds: {},
      togglePostLike: (postId) =>
        set((state) => {
          const next = { ...state.likedPostIds };
          if (next[postId]) {
            delete next[postId];
          } else {
            next[postId] = true;
          }
          return { likedPostIds: next };
        }),
      toggleFollow: (userId) =>
        set((state) => {
          const next = { ...state.followedUserIds };
          if (next[userId]) {
            delete next[userId];
          } else {
            next[userId] = true;
          }
          return { followedUserIds: next };
        }),
    }),
    {
      name: "staybook.social",
    },
  ),
);

export const selectIsLiked = (postId: string) => (state: SocialState) =>
  Boolean(state.likedPostIds[postId]);

export const selectIsFollowing = (userId: string) => (state: SocialState) =>
  Boolean(state.followedUserIds[userId]);
