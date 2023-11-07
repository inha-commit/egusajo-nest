import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { UserEntity } from '../../entities/user.entity';
import { PresentEntity } from '../../entities/present.entity';
import { PresentImageEntity } from '../../entities/presentImage.entity';
import { FollowEntity } from '../../entities/follow.entity';
import { FundingEntity } from '../../entities/funding.entity';

export default class UserSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const presentRepository = dataSource.getRepository(PresentEntity);
    const presentImageRepository = dataSource.getRepository(PresentImageEntity);
    const fundingRepository = dataSource.getRepository(FundingEntity);

    const userFactory = factoryManager.get(UserEntity);
    const followFactory = factoryManager.get(FollowEntity);
    const presentFactory = factoryManager.get(PresentEntity);
    const fundingFactory = factoryManager.get(FundingEntity);
    const presentImageFactory = factoryManager.get(PresentImageEntity);

    const users = await userFactory.saveMany(100);
    await followFactory.saveMany(10000);

    const presents = [];

    await Promise.all(
      users.map(async (user) => {
        const present = await presentFactory.make({
          User: user,
          shortComment: `${user.nickname}의 선물`,
        });

        const presentImages = await Promise.all(
          Array(5)
            .fill(0)
            .map(async () => {
              return presentImageFactory.make({
                Present: present,
              });
            }),
        );

        await presentImageRepository.save(presentImages);

        presents.push(present);
      }),
    );

    await presentRepository.save(presents);

    await Promise.all(
      presents.map(async (present) => {
        const Sender = users[Math.floor(Math.random() * users.length)];

        const fundings = await Promise.all(
          Array(20)
            .fill(0)
            .map(async () => {
              return fundingFactory.make({
                Present: present,
                Receiver: present.User,
                Sender: Sender,
              });
            }),
        );

        await fundingRepository.save(fundings);
      }),
    );
  }
}
