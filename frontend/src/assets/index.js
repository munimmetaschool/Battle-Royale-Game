// backgrounds
import saiman from './background/saiman.jpg';
import panight from './background/panight.jpg';

// cards
import furiosa from './Furiosa.png';
import geomancer from './Geomancer.png';
import goreHorn from './Gore_Horn.png';
import heartseeker from './Heartseeker.png';

// players
import player01 from './player01.png';
import player02 from './player02.png';

export const allCards = [
  furiosa,
  geomancer,
  goreHorn,
  heartseeker,
];

export {
  saiman,
  panight,
  furiosa,
  geomancer,
  goreHorn,
  heartseeker,
  player01,
  player02,
};

export const battlegrounds = [
  { id: 'bg-saiman', image: saiman, name: 'Saiman' },
  { id: 'bg-panight', image: panight, name: 'Panight' },
];

export const gameRules = [
  'Card with the same defense and attack point will cancel each other out.',
  'Attack points from the attacking card will deduct the opposing player’s health points.',
  'If P1 does not defend, their health wil be deducted by P2’s attack.',
  'If P1 defends, P2’s attack is equal to P2’s attack - P1’s defense.',
  'If a player defends, they refill 3 Mana',
  'If a player attacks, they spend 3 Mana',
];