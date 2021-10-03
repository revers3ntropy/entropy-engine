export class publicField {
    constructor(config) {
        this.array = config.array || false;
        this.type = config.type || typeof config.value || 'string';
        this.value = config.value;
        this.name = config.name;
        this.description = config.description || '';
        this.default = config.default;
        this.assetType = config.assetType;
        if (this.array) {
            if (this.value)
                if (!Array.isArray(this.value))
                    this.value = [this.value];
                else
                    this.value = [];
        }
    }
}
