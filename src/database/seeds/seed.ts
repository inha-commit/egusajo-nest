import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { UserEntity } from '../../entities/user.entity';
import { PresentEntity } from '../../entities/present.entity';
import { PresentImageEntity } from '../../entities/presentImage.entity';
import { FollowEntity } from '../../entities/follow.entity';
import { FundingEntity } from '../../entities/funding.entity';

export default class UserSeeder implements Seeder {
  private async generatePresents(users, presentFactory) {
    return Promise.all(
      users.map(async (user) => {
        const present = await presentFactory.make({
          User: user,
          shortComment: `${user.nickname}의 선물`,
        });
        return present;
      }),
    );
  }

  private async generatePresentImages(presents, presentImageFactory) {
    return Promise.all(
      presents.map(async (present) => {
        const presentImages = await Promise.all(
          Array(5)
            .fill(0)
            .map(async () => {
              return presentImageFactory.make({
                Present: present,
              });
            }),
        );

        return presentImages;
      }),
    );
  }

  private async generateFundings(presents, users, fundingFactory) {
    return Promise.all(
      presents.map(async (present) => {
        const sender = users[Math.floor(Math.random() * users.length)];

        const fundings = await Promise.all(
          Array(20)
            .fill(0)
            .map(async () => {
              return fundingFactory.make({
                Present: present,
                Receiver: present.User,
                Sender: sender,
              });
            }),
        );

        return fundings;
      }),
    );
  }

  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const presentRepository = dataSource.getRepository(PresentEntity);
    const presentImageRepository = dataSource.getRepository(PresentImageEntity);
    const fundingRepository = dataSource.getRepository(FundingEntity);
    const followRepository = dataSource.getRepository(FollowEntity);

    const userFactory = factoryManager.get(UserEntity);
    const followFactory = factoryManager.get(FollowEntity);
    const presentFactory = factoryManager.get(PresentEntity);
    const fundingFactory = factoryManager.get(FundingEntity);
    const presentImageFactory = factoryManager.get(PresentImageEntity);

    const users = await userFactory.saveMany(1000);

    // Followings 삽입
    await followFactory.saveMany(10000);

    // Presents 삽입
    const presents = await this.generatePresents(users, presentFactory);
    await presentRepository.save(presents);

    // PresentImages 삽입
    const presentImages = await this.generatePresentImages(
      presents,
      presentImageFactory,
    );
    await presentImageRepository.save(presentImages.flat());

    // Fundings 삽입
    const fundings = await this.generateFundings(
      presents,
      users,
      fundingFactory,
    );
    await fundingRepository.save(fundings.flat());
  }
}
