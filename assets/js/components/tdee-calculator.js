Vue.component('tdee-calculator', {
    props: {
        minAllowedAge: { type: Number, default: 10 },
        maxAllowedAge: { type: Number, default: 110 },
        minAllowedWeight: { type: Number, default: 60 },
        maxAllowedWeight: { type: Number, default: 1500 }
    },
    mounted: function() {
        let saved = localStorage.getItem('tdee-values');
        if (saved) { 
            try {
                saved = JSON.parse(saved);
                if (saved.age) this.inputs.age = saved.age;
                if (saved.weight) this.inputs.weight = saved.weight;
                if (saved.height) this.inputs.height = saved.height;
                if (saved.activity) this.inputs.activity = saved.activity;
                if (saved.loss) this.inputs.loss = saved.loss;
                if (saved.goal) this.inputs.goal = saved.goal;
                if (saved.sex) this.sex = saved.sex;
                if (typeof saved.legal != 'undefined') this.legal = saved.legal;
            } catch {}
        }
    },
    data: function() { 
        return { 
            errors: [], 
            validated: false,
            legal: false,
            sex: '',
            computations : { age: 0, weight: 0, height: 0, activity: 0, goal: 0, loss: 0 },
            inputs: { age: '', weight: '', height: '', activity: 0, goal: '', loss: 0 }
        };
     },
    watch: {
        'inputs.age': function(v) { this.computations.age = this.tryParse(v,0); this.save();},
        'inputs.weight': function(v) { this.computations.weight = this.tryParse(v,0); this.save();},
        'inputs.height': function(v) { this.computations.height = this.tryParse(v,0); this.save();},
        'inputs.activity': function(v) { this.computations.activity = this.tryParse(v,0); this.save();},
        'inputs.loss': function(v) { this.computations.loss = this.tryParse(v,0); this.save();},
        'inputs.goal': function(v) { this.computations.goal = this.tryParse(v,0); this.save();},
        sex: function(v) {this.save();},
        legal: function(v) {this.save();}
    },
    computed: {
        ErrorMessage: function() {
            var c = this.computations;
            if (this.inputs.age == '') return 'Enter age';
            if (c.age < this.minAllowedAge || c.age > this.maxAllowedAge) return 'Invalid age';
            if (this.inputs.weight == '') return 'Enter weight';
            if (c.weight < this.minAllowedWeight || c.age > this.maxAllowedWeight) return 'Invalid weight';
            if (this.HeightInInches == 0) return 'Enter height';
            if (this.sex == '') return 'Select Sex';
            if (c.activity == 0) return 'Select Activity Level';
            return null;
        },
        IsValid: function() {
            return this.ErrorMessage == null;
        },
        HeightInInches: function() {
            if (this.inputs.height == '') return 0;
            let inInches = parseInt(this.inputs.height);
            if (!isNaN(inInches) && inInches>36 && inInches<96) return inInches;
            if (/^[345678]'?(\s([0-9]|1[01]?)"?)?\s*$/gi.test(this.inputs.height)) {
                let m = /^([345678])'?(?:\s([0-9]|1[01]?)"?)?\s*$/gi.exec(this.inputs.height);
                return parseInt(m[1])*12 + (m[2]?(parseInt(m[2])):0);
            }
            return 0;
        },
        sexConversion: function() { return this.sex==='male'?5:-161; },
        DailyCalories: function() {
            var c = this.computations;
            if (c.weight < this.minAllowedWeight || c.weight > this.maxAllowedWeight
                || c.age < this.minAllowedAge || c.age > this.maxAllowedAge
                || this.HeightInInches == 0
                || c.activity < 0
            ) return 0;

            const kg = c.weight * 0.45359237;
            const cm = c.height * 2.54;
            const bmr = (10 * kg) + (6.25 * cm) - (5 * c.age) + this.sexConversion;
            const maint = bmr * c.activity;
            const cal = Math.max(1200, maint - (c.loss * 500));
            return Math.round(cal);
        },
        WeeklyCalories: function() {
            return this.DailyCalories*7;
        },
        WeeksRemaining: function () {
            const r = Math.ceil((this.computations.weight - this.computations.goal) / this.computations.loss);
            if (isNaN(r) || !isFinite(r)) return -1;
            return r;
        }
    },
    methods: {
        tryParse: function(value, defaultValue) { 
            let ival = parseFloat(value);
            if (isNaN(ival)) return defaultValue;
            return ival;
         },
         save: function() {
            localStorage.setItem('tdee-values', JSON.stringify(Object.assign({}, this.inputs, {sex:this.sex, legal:this.legal})));
         }
    },
    template: `
         <div>
            <h2>TDEE Calculator</h2>
            <form id="tdeeForm">
                <label for="age">Age</label>
                <input v-model="inputs.age" name="age" type="number" placeholder="Age">
                <label for="weight">Weight</label>
                <input v-model="inputs.weight" name="weight" type="number" placeholder="Weight (lbs)">
                <label for="height">Height <span style="opacity:0.6;font-size:smaller;" v-if="HeightInInches>0">({{HeightInInches}} in.)</span></label>
                <input v-model="inputs.height" name="height" type="text" placeholder="Height (f' in&quot;)">
                <label for="sex">Sex</label>
                <select v-model="sex" name="sex">
                    <option value=""></option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                </select>
                <label for="activity">Activity Level</label>
                <select v-model="inputs.activity">
                    <option value="0"></option>
                    <option value="1.2">Sedentary</option>
                    <option value="1.55">Moderate</option>
                    <option value="1.725">Active</option>
                </select>
                <label for="loss">Weight loss per week</label>
                <select v-model="inputs.loss" name="loss">
                    <option value=""></option>
                    <option value="0.5">0.5 lb</option>
                    <option value="1">1 lb</option>
                    <option value="2">2 lb</option>
                </select>
                <label for="goal">Goal Weight (lbs)</label>
                <input v-model="inputs.goal" name="goal" type="number" placeholder="Optional goal weight">
                <label>
                    <input v-model="legal" type="checkbox" id="legalCheck"> This is not medical advice. Data is only stored on your device.
                </label>
            </form>
        
            <article class="tdee-result-card" id="tdeeResult" v-if="legal">
                <div>{{ErrorMessage}}</div>
                <div v-if="IsValid">
                    <div><strong>Daily Calories</strong><br><span>{{DailyCalories}} kcal</span></div>
                    <div class="divider"></div>
                    <div><strong>Weekly Calories</strong><br><span>{{WeeklyCalories}} kcal</span></div>
                    <div class="divider"></div>
                    <div id="eta" v-if="WeeksRemaining>=0">Estimated completion: {{WeeksRemaining}} weeks</div>
                </div>
            </article>
        </div>
   
    `
})