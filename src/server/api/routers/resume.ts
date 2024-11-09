import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

// Input validation schemas
const skillGroupSchema = z.object({
  field: z.string(),
  entities: z.array(z.string()),
});

const educationSchema = z.object({
  degree: z.string(),
  fieldOfStudy: z.string(),
  university: z.string(),
  cityAndCountry: z.string(),
  from: z.string(),
  to: z.string(),
  expected: z.string().optional(),
  gradePointAverage: z.string().optional(),
  thesis: z.string().optional(),
  thesisGrade: z.string().optional(),
});

const experienceSchema = z.object({
  position: z.string(),
  company: z.string(),
  cityAndCountry: z.string(),
  from: z.string(),
  to: z.string(),
  infos: z.array(z.string()),
});

const projectSchema = z.object({
  name: z.string(),
  description: z.string(),
  image: z.string().optional(),
  github: z.string().optional(),
  demo: z.string().optional(),
});

const createResumeSchema = z.object({
  slug: z.string(),
  preName: z.string(),
  lastName: z.string(),
  telephone: z.string().optional(),
  email: z.string(),
  cityAndCountry: z.string().optional(),
  github: z.string().optional(),
  linkedin: z.string().optional(),
  website: z.string().optional(),
  objective: z.string().optional(),
  domain: z.string().optional(),
  impressum: z.string().optional(),
  avatar: z.string().optional(),
  extracurricular: z.array(z.string()),
  newPageBefore: z.array(z.string()),
});

export const resumeRouter = createTRPCRouter({
  // get by slug (already implemented)
  getBySlug: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const resume = await ctx.db.resume.findFirst({
      where: { slug: input },
      include: {
        education: true,
        skills: true,
        experience: true,
        projects: true,
      },
    });

    return resume ?? null;
  }),

  // create resume
  create: protectedProcedure
    .input(createResumeSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.resume.create({
        data: {
          ...input,
          userId: ctx.session.user.id,
        },
      });
    }),

  // update resume
  update: protectedProcedure
    .input(createResumeSchema)
    .mutation(async ({ ctx, input }) => {
      console.log({ input });
      
      const resume = await ctx.db.resume.findFirst({
        where: { slug: input.slug },
      });

      if (!resume || resume.userId !== ctx.session.user.id) {
        console.log(resume, ctx.session.user.id); 
        throw new Error("Not authorized");
      }

      return ctx.db.resume.update({
        where: { slug: input.slug },
        data: input,
      });
    }),

  // delete resume
  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const resume = await ctx.db.resume.findFirst({
        where: { slug: input },
      });

      if (!resume || resume.userId !== ctx.session.user.id) {
        throw new Error("Not authorized");
      }

      return ctx.db.resume.delete({
        where: { slug: input },
      });
    }),

  // add education
  addEducation: protectedProcedure
    .input(z.object({
      resumeSlug: z.string(),
      education: educationSchema,
    }))
    .mutation(async ({ ctx, input }) => {
      const resume = await ctx.db.resume.findFirst({
        where: { slug: input.resumeSlug },
      });

      if (!resume || resume.userId !== ctx.session.user.id) {
        throw new Error("Not authorized");
      }

      return ctx.db.education.create({
        data: {
          ...input.education,
          resumeId: input.resumeSlug,
        },
      });
    }),

  // add skill group
  addSkillGroup: protectedProcedure
    .input(z.object({
      resumeSlug: z.string(),
      skillGroup: skillGroupSchema,
    }))
    .mutation(async ({ ctx, input }) => {
      const resume = await ctx.db.resume.findFirst({
        where: { slug: input.resumeSlug },
      });

      if (!resume || resume.userId !== ctx.session.user.id) {
        throw new Error("Not authorized");
      }

      return ctx.db.skillGroup.create({
        data: {
          ...input.skillGroup,
          resumeId: input.resumeSlug,
        },
      });
    }),

  // add experience
  addExperience: protectedProcedure
    .input(z.object({
      resumeSlug: z.string(),
      experience: experienceSchema,
    }))
    .mutation(async ({ ctx, input }) => {
      const resume = await ctx.db.resume.findFirst({
        where: { slug: input.resumeSlug },
      });

      if (!resume || resume.userId !== ctx.session.user.id) {
        throw new Error("Not authorized");
      }

      return ctx.db.experience.create({
        data: {
          ...input.experience,
          resumeId: input.resumeSlug,
        },
      });
    }),

  // add project
  addProject: protectedProcedure
    .input(z.object({
      resumeSlug: z.string(),
      project: projectSchema,
    }))
    .mutation(async ({ ctx, input }) => {
      const resume = await ctx.db.resume.findFirst({
        where: { slug: input.resumeSlug },
      });

      if (!resume || resume.userId !== ctx.session.user.id) {
        throw new Error("Not authorized");
      }

      return ctx.db.project.create({
        data: {
          ...input.project,
          resumeId: input.resumeSlug,
        },
      });
    }),

    getSlugByUserId: protectedProcedure.query(async ({ ctx }) => {
      const resume = await ctx.db.resume.findFirst({
        where: { userId: ctx.session.user.id },
      });

      return resume?.slug ?? null;
    }),

});