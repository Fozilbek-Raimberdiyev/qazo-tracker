import { User } from '../entities/user.entity';
import { UserResDto } from '../dto/user.dto';

export const toUserResDto = (user: User): UserResDto =>
  new UserResDto({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    isEmailVerified: user.isEmailVerified,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    picture: user.picture,
    locale: user.locale,
    googleRaw: user.googleRaw,
  });
