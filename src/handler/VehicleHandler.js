import CryptoUtil from "../utils/CryptoUtil.js";
import Uuidv4 from "../utils/UuidUtil.js";

class VehicleHandler {

    constructor() {
        this.crypto = new CryptoUtil();
        this.uuid = new Uuidv4();
    }

    async test(body) {

        return "testtt";
    }
}

export default VehicleHandler;