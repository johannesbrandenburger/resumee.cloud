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

  getSlugByUserId: protectedProcedure.query(async ({ ctx }) => {
    const resume = await ctx.db.resume.findFirst({
      where: { userId: ctx.session.user.id },
    });

    return resume?.slug ?? null;
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

  // create resume by slug only
  createBySlug: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {

      const user = await ctx.db.user.findFirst({
        where: { id: ctx.session.user.id },
      });

      return ctx.db.resume.create({
        data: {
          slug: input,
          userId: ctx.session.user.id,
          preName: user?.name ?? "",
          lastName: "",
          telephone: "",
          email: "",
        },
      });
    }),

  // update resume
  update: protectedProcedure
    .input(z.object({
      slug: z.string(),
      preName: z.string().optional(),
      lastName: z.string().optional(),
      telephone: z.string().optional(),
      email: z.string().optional(),
      cityAndCountry: z.string().optional(),
      github: z.string().optional(),
      linkedin: z.string().optional(),
      website: z.string().optional(),
      objective: z.string().optional(),
      domain: z.string().optional(),
      impressum: z.string().optional(),
      avatar: z.string().optional(),
      extracurricular: z.array(z.string()).optional(),
      newPageBefore: z.array(z.string()).optional(),
    }))
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
        include: {
          education: true,
          skills: true,
          experience: true,
          projects: true,
        },
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

  // delete education
  deleteEducation: protectedProcedure
    .input(z.object({
      resumeSlug: z.string(),
      educationId: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const resume = await ctx.db.resume.findFirst({
        where: { slug: input.resumeSlug },
      });

      if (!resume || resume.userId !== ctx.session.user.id) {
        throw new Error("Not authorized");
      }

      return ctx.db.education.delete({
        where: { id: input.educationId },
      });
    }),

  // delete skill group
  deleteSkillGroup: protectedProcedure
    .input(z.object({
      resumeSlug: z.string(),
      skillGroupId: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const resume = await ctx.db.resume.findFirst({
        where: { slug: input.resumeSlug },
      });

      if (!resume || resume.userId !== ctx.session.user.id) {
        throw new Error("Not authorized");
      }

      return ctx.db.skillGroup.delete({
        where: { id: input.skillGroupId },
      });
    }),

  // delete experience
  deleteExperience: protectedProcedure
    .input(z.object({
      resumeSlug: z.string(),
      experienceId: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const resume = await ctx.db.resume.findFirst({
        where: { slug: input.resumeSlug },
      });

      if (!resume || resume.userId !== ctx.session.user.id) {
        throw new Error("Not authorized");
      }

      return ctx.db.experience.delete({
        where: { id: input.experienceId },
      });
    }),

  // delete project
  deleteProject: protectedProcedure
    .input(z.object({
      resumeSlug: z.string(),
      projectId: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const resume = await ctx.db.resume.findFirst({
        where: { slug: input.resumeSlug },
      });

      if (!resume || resume.userId !== ctx.session.user.id) {
        throw new Error("Not authorized");
      }

      return ctx.db.project.delete({
        where: { id: input.projectId },
      });
    }),

  // update education
  updateEducation: protectedProcedure
    .input(z.object({
      resumeSlug: z.string(),
      educationId: z.string(),
      education: z.object({
        degree: z.string().optional(),
        fieldOfStudy: z.string().optional(),
        university: z.string().optional(),
        cityAndCountry: z.string().optional(),
        from: z.string().optional(),
        to: z.string().optional(),
        expected: z.string().optional(),
        gradePointAverage: z.string().optional(),
        thesis: z.string().optional(),
        thesisGrade: z.string().optional(),
      }),
    }))
    .mutation(async ({ ctx, input }) => {
      const resume = await ctx.db.resume.findFirst({
        where: { slug: input.resumeSlug },
      });

      if (!resume || resume.userId !== ctx.session.user.id) {
        throw new Error("Not authorized");
      }

      return ctx.db.education.update({
        where: { id: input.educationId },
        data: input.education,
      });
    }),

  // update skill group
  updateSkillGroup: protectedProcedure
    .input(z.object({
      resumeSlug: z.string(),
      skillGroupId: z.string(),
      skillGroup: z.object({
        field: z.string().optional(),
        entities: z.array(z.string()).optional(),
      }),
    }))
    .mutation(async ({ ctx, input }) => {
      const resume = await ctx.db.resume.findFirst({
        where: { slug: input.resumeSlug },
      });

      if (!resume || resume.userId !== ctx.session.user.id) {
        throw new Error("Not authorized");
      }

      return ctx.db.skillGroup.update({
        where: { id: input.skillGroupId },
        data: input.skillGroup,
      });
    }),

  // update experience
  updateExperience: protectedProcedure
    .input(z.object({
      resumeSlug: z.string(),
      experienceId: z.string(),
      experience: z.object({
        position: z.string().optional(),
        company: z.string().optional(),
        cityAndCountry: z.string().optional(),
        from: z.string().optional(),
        to: z.string().optional(),
        infos: z.array(z.string()).optional(),
      }),
    }))
    .mutation(async ({ ctx, input }) => {
      const resume = await ctx.db.resume.findFirst({
        where: { slug: input.resumeSlug },
      });

      if (!resume || resume.userId !== ctx.session.user.id) {
        throw new Error("Not authorized");
      }

      return ctx.db.experience.update({
        where: { id: input.experienceId },
        data: input.experience,
      });
    }),

  // update project
  updateProject: protectedProcedure
    .input(z.object({
      resumeSlug: z.string(),
      projectId: z.string(),
      project: z.object({
        name: z.string().optional(),
        description: z.string().optional(),
        image: z.string().optional(),
        github: z.string().optional(),
        demo: z.string().optional(),
      }),
    }))
    .mutation(async ({ ctx, input }) => {
      const resume = await ctx.db.resume.findFirst({
        where: { slug: input.resumeSlug },
      });

      if (!resume || resume.userId !== ctx.session.user.id) {
        throw new Error("Not authorized");
      }

      return ctx.db.project.update({
        where: { id: input.projectId },
        data: input.project,
      });
    }),

});