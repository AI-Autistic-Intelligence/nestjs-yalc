import { faker } from '@faker-js/faker';
export const DEF_FAKER_MAX_RETRIES = 1500;
export const DEF_FAKER_MAX_TIME = 250;
export class FakerHelper {
    constructor() {
        this.uniqueStore = new Set();
        this.randomDecimal = (min, max, precision) => {
            return faker.number
                .float({ fractionDigits: precision, min: min, max: max })
                .toString();
        };
        this.randomBirthDate = () => {
            const birthDate = faker.date.past({ years: 82 });
            birthDate.setFullYear(birthDate.getFullYear() - 18);
            const mm = (birthDate.getMonth() + 1).toString().padStart(2, '0');
            const dd = birthDate.getDate().toString().padStart(2, '0');
            const yyyy = birthDate.getFullYear();
            return `${yyyy}-${mm}-${dd}`;
        };
        this.randomLockDate = () => {
            const random = faker.number.int(2);
            if (random === 0) {
                return faker.date.past({ years: 3 });
            }
            else if (random === 1) {
                return faker.date.future({ years: 1 });
            }
            else {
                return undefined;
            }
        };
    }
    unique(method, args, options) {
        const maxRetries = options?.maxRetries ?? DEF_FAKER_MAX_RETRIES;
        let result;
        let retries = 0;
        do {
            result = method(...args);
            retries++;
        } while (this.uniqueStore.has(String(result)) && retries < maxRetries);
        if (this.uniqueStore.has(String(result))) {
            throw new Error(`Faker max retries reached for unique value: ${String(result)}`);
        }
        this.uniqueStore.add(String(result));
        return result;
    }
    createPerson() {
        const gender = faker.number.int(1) === 0 ? 'male' : 'female';
        const firstName = faker.person.firstName(gender);
        const lastName = faker.person.lastName(gender);
        return {
            gender,
            firstName,
            lastName,
            email: this.generateNewEmail(firstName, lastName, 'gmail.test'),
        };
    }
    generateNewEmail(firstName, lastName, provider) {
        return this.unique(faker.internet.email, [{ firstName, lastName, provider }]);
    }
    randomFromEnum(inputEnum) {
        const randInt = faker.number.int(Object.keys(inputEnum).length - 1);
        return inputEnum[Object.keys(inputEnum)[randInt]];
    }
}
//# sourceMappingURL=faker-helper.js.map