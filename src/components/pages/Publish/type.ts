import type {
  Field,
  FieldSelect,
  FieldNumber,
  FieldNumberRange,
  FieldSelectOption,
  Form,
  Profile,
  ProfileLink,
} from '@prisma/client';

export type FormData = Form & {
  profile: (Profile & { profileLinks: ProfileLink[] }) | null;
  fields: (Field & {
    fieldSelect:
      | (FieldSelect & {
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
