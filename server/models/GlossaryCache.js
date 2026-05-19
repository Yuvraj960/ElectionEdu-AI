const mongoose = require('mongoose');

const glossaryCacheSchema = new mongoose.Schema({
  term: { type: String, required: true, lowercase: true },
  country: { type: String, required: true },
  definition: { type: String, required: true },
  example: { type: String, default: '' },
  relatedTerms: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

glossaryCacheSchema.index({ term: 1, country: 1 }, { unique: true });

module.exports = mongoose.model('GlossaryCache', glossaryCacheSchema);
