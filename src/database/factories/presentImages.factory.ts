import { setSeederFactory } from 'typeorm-extension';
import { PresentImageEntity } from '../../entities/presentImage.entity';

export default setSeederFactory(PresentImageEntity, (faker) => {
  const presentImage = new PresentImageEntity();

  presentImage.src = faker.image.url();

  return presentImage;
});
