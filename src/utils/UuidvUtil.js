import { v4 as uuidv4 } from "uuid";

class Uuidv4 {

    async randomUuid() {
        return uuidv4();
    }
}

export default Uuidv4;