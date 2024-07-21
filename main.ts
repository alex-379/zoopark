interface Enclosure {
    biome: string,
    square: number,
    hasWater: boolean,
    animals: Animal[],
}

interface Species {
    name: string,
    biome: string;
    needsWater: boolean,
    square: number,
    food: string,
    isPredator: boolean,
}

interface Animal {
    name: string,
    foodAmount: number,
    species: Species,
}

class Zoo {
    enclosures: Enclosure[] = [];

    addEnclosure(enclosure: Enclosure) {
        this.enclosures.push(enclosure);
    }

    canAccommodate(animal: Animal, enclosure: Enclosure): string | null {
        if (animal.species.biome !== enclosure.biome) {
            return 'Несоответствие биома';
        }
        if (animal.species.needsWater && !enclosure.hasWater) {
            return 'В вольере нет водоёма';
        }
        const totalAnimals = enclosure.animals.length + 1;
        if (totalAnimals * animal.species.square > enclosure.square) {
            return 'Недостаточно места в вольере';
        }
        if (animal.species.isPredator) {
            const hasDifferentSpecies = enclosure.animals.some(a => a.species.name !== animal.species.name);
            if (hasDifferentSpecies) {
                return 'Хищники могут жить только с представителями своего вида.';
            }
        } else {
            const allHerbivores = enclosure.animals.every(a => !a.species.isPredator);
            if (!allHerbivores) {
                return 'Травоядные могут жить только с другими травоядными.';
            }
        }
        return null;
    }

    addAnimalToEnclosure(animal: Animal, enclosure: Enclosure): boolean {
        const reason = this.canAccommodate(animal, enclosure);
        if (reason) {
            console.log(`Нельзя подселить ${animal.species.name} ${animal.name}: ${reason}`);
            return false;
        }
        enclosure.animals.push(animal);
        enclosure.square -= animal.species.square;
        console.log(`${animal.species.name} ${animal.name} подселено. Доступная площадь в вольере: ${enclosure.square}`);
        return true;
    }

    removeAnimalFromEnclosure(animal: Animal, enclosure: Enclosure): boolean {
        const index = enclosure.animals.indexOf(animal);
        if (index > -1) {
            enclosure.animals.splice(index, 1);
            enclosure.square += animal.species.square;
            return true;
        }
        return false;
    }

    calculateTotalFood(): number {
        return this.enclosures.reduce((total, enclosure) => {
            return total + enclosure.animals.reduce((sum, animal) => sum + animal.foodAmount, 0);
        }, 0);
    }
}

const zoo = new Zoo();

const savannaEnclosure: Enclosure = {
    biome: 'Саванна',
    square: 1000,
    hasWater: false,
    animals: []
};

const forestEnclosure: Enclosure = {
    biome: 'Лес',
    square: 800,
    hasWater: true,
    animals: []
};

zoo.addEnclosure(savannaEnclosure);
zoo.addEnclosure(forestEnclosure);

const giraffe: Species = {
    name: 'Жираф',
    biome: 'Саванна',
    needsWater: false,
    square: 200,
    food: 'Листья',
    isPredator: false
};

const lion: Species = {
    name: 'Лев',
    biome: 'Саванна',
    needsWater: true,
    square: 300,
    food: 'Мясо',
    isPredator: true
};

const giraffeMelman: Animal = {
    name: 'Мелман',
    foodAmount: 10,
    species: giraffe
};

const lionSimba: Animal = {
    name: 'Симба',
    foodAmount: 15,
    species: lion
};

zoo.addAnimalToEnclosure(giraffeMelman, savannaEnclosure);
zoo.addAnimalToEnclosure(lionSimba, savannaEnclosure); 

const totalFood = zoo.calculateTotalFood();
console.log(`Общее количество еды для животных: ${totalFood}`);