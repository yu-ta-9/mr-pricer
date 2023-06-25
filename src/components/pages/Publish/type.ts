import type {
  Field,
  FieldNumber,
  FieldNumberRange,
  FieldSelectOption,
  Form,
  Prisma,
  Profile,
  ProfileLink,
} from '@prisma/client';

export type FormData = Form & {
  profile: Profile | null;
  fields: (Field & {
    fieldSelect:
      | (Prisma.FieldSelect & {
          fieldSelectOptions: FieldSelectOption[];
        })
      | null;
    fieldNumber:
      | (FieldNumber & {
          fieldNumberRanges: FieldNumberRange[];
        })
      | null;
  })[];
};

export type ProfileData = Profile & { profileLinks: ProfileLink[] };
