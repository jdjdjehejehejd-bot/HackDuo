import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { protectedProcedure } from "./_core/trpc";
import { addClassroomMember, createClassroom, getClassroomOverview, listOwnedClassrooms } from "./db";
import { nanoid } from "nanoid";
import { z } from "zod";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  classroom: router({
    list: protectedProcedure.query(({ ctx }) => listOwnedClassrooms(ctx.user.id)),
    create: protectedProcedure
      .input(z.object({ name: z.string().trim().min(1).max(120) }))
      .mutation(({ ctx, input }) => createClassroom({ ownerId: ctx.user.id, name: input.name, inviteCode: `TEUM-${nanoid(6).toUpperCase()}` })),
    addStudent: protectedProcedure
      .input(z.object({ classroomId: z.number().int().positive(), displayName: z.string().trim().min(1).max(80), grade: z.string().trim().max(32).optional() }))
      .mutation(({ ctx, input }) => addClassroomMember({ classroomId: input.classroomId, displayName: input.displayName, grade: input.grade ?? null, userId: null }, ctx.user.id)),
    overview: protectedProcedure
      .input(z.object({ classroomId: z.number().int().positive() }))
      .query(({ ctx, input }) => getClassroomOverview(input.classroomId, ctx.user.id)),
  }),

  // TODO: add feature routers here, e.g.
  // todo: router({
  //   list: protectedProcedure.query(({ ctx }) =>
  //     db.getUserTodos(ctx.user.id)
  //   ),
  // }),
});

export type AppRouter = typeof appRouter;
