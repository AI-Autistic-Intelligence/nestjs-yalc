"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FakerHelper = exports.DEF_FAKER_MAX_TIME = exports.DEF_FAKER_MAX_RETRIES = void 0;
const faker_1 = require("@faker-js/faker");
exports.DEF_FAKER_MAX_RETRIES = 1500;
exports.DEF_FAKER_MAX_TIME = 250;
class FakerHelper {
    constructor() {
        this.generatedEmails = new Set();
        this.randomDecimal = (min, max, precision) => {
            return faker_1.faker.number
                .float({ multipleOf: precision, min: min, max: max })
                .toString();
        };
        this.randomBirthDate = (start = 18, end = 100) => {
            const birthDate = faker_1.faker.date.past({ years: end - start });
            birthDate.setUTCFullYear(birthDate.getUTCFullYear() - start);
            const yyyy = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(birthDate);
            const mm = new Intl.DateTimeFormat('en', { month: 'numeric' }).format(birthDate);
            const dd = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(birthDate);
            return `${yyyy}-${mm}-${dd}`;
        };
        this.randomLockDate = () => {
            const random = faker_1.faker.number.int(2);
            if (random === 0) {
                return faker_1.faker.date.past({ years: 3 });
            }
            else if (random === 1) {
                return faker_1.faker.date.future({ years: 1 });
            }
            else {
                return undefined;
            }
        };
    }
    createPerson() {
        const gender = faker_1.faker.number.int(1) === 0 ? 'male' : 'female';
        const firstName = faker_1.faker.person.firstName(gender);
        const lastName = faker_1.faker.person.lastName(gender);
        return {
            gender,
            firstName,
            lastName,
            email: this.generateNewEmail(firstName, lastName, 'gmail.test'),
        };
    }
    generateNewEmail(firstName, lastName, provider) {
        const startTime = Date.now();
        for (let attempt = 0; attempt < exports.DEF_FAKER_MAX_RETRIES; attempt++) {
            const email = faker_1.faker.internet.email({ firstName, lastName, provider });
            if (!this.generatedEmails.has(email)) {
                this.generatedEmails.add(email);
                return email;
            }
            if (Date.now() - startTime > exports.DEF_FAKER_MAX_TIME) {
                break;
            }
        }
        const fallbackEmail = faker_1.faker.internet.email({
            firstName,
            lastName,
            provider,
        });
        this.generatedEmails.add(fallbackEmail);
        return fallbackEmail;
    }
    randomFromEnum(inputEnum) {
        const randInt = faker_1.faker.number.int(Object.keys(inputEnum).length - 1);
        return inputEnum[Object.keys(inputEnum)[randInt]];
    }
}
exports.FakerHelper = FakerHelper;
//# sourceMappingURL=faker-helper.js.map