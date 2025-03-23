import { faker } from '@faker-js/faker';

export function generateFakeUsers(count = 10000) {
  const users = [];

  for (let i = 0; i < count; i++) {
    users.push({
      id: i,
      name: faker.person.fullName(),
      email: faker.internet.email(),
      avatar: faker.image.avatar() // Додаємо аватар
    });
  }

  return users;
}
