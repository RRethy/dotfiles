'use strict';

var vscode = require('vscode');
var path$1 = require('path');
var os = require('os');
var fs = require('fs');
var cp = require('child_process');
var util_1 = require('util');
var crypto_1 = require('crypto');
var net_1 = require('net');
var assert_1 = require('assert');
var readline = require('readline');
var Stream = require('stream');
var http = require('http');
var Url = require('url');
var https = require('https');
var zlib = require('zlib');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var vscode__default = /*#__PURE__*/_interopDefaultLegacy(vscode);
var path__default = /*#__PURE__*/_interopDefaultLegacy(path$1);
var os__default = /*#__PURE__*/_interopDefaultLegacy(os);
var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);
var cp__default = /*#__PURE__*/_interopDefaultLegacy(cp);
var util_1__default = /*#__PURE__*/_interopDefaultLegacy(util_1);
var crypto_1__default = /*#__PURE__*/_interopDefaultLegacy(crypto_1);
var net_1__default = /*#__PURE__*/_interopDefaultLegacy(net_1);
var assert_1__default = /*#__PURE__*/_interopDefaultLegacy(assert_1);
var readline__default = /*#__PURE__*/_interopDefaultLegacy(readline);
var Stream__default = /*#__PURE__*/_interopDefaultLegacy(Stream);
var http__default = /*#__PURE__*/_interopDefaultLegacy(http);
var Url__default = /*#__PURE__*/_interopDefaultLegacy(Url);
var https__default = /*#__PURE__*/_interopDefaultLegacy(https);
var zlib__default = /*#__PURE__*/_interopDefaultLegacy(zlib);

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function getAugmentedNamespace(n) {
	if (n.__esModule) return n;
	var a = Object.defineProperty({}, '__esModule', {value: true});
	Object.keys(n).forEach(function (k) {
		var d = Object.getOwnPropertyDescriptor(n, k);
		Object.defineProperty(a, k, d.get ? d : {
			enumerable: true,
			get: function () {
				return n[k];
			}
		});
	});
	return a;
}

function createCommonjsModule(fn) {
  var module = { exports: {} };
	return fn(module, module.exports), module.exports;
}

// Note: this is the semver.org version of the spec that it implements
// Not necessarily the package version of this code.
const SEMVER_SPEC_VERSION = '2.0.0';

const MAX_LENGTH = 256;
const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER ||
  /* istanbul ignore next */ 9007199254740991;

// Max safe segment length for coercion.
const MAX_SAFE_COMPONENT_LENGTH = 16;

var constants = {
  SEMVER_SPEC_VERSION,
  MAX_LENGTH,
  MAX_SAFE_INTEGER,
  MAX_SAFE_COMPONENT_LENGTH
};

const debug = (
  typeof process === 'object' &&
  process.env &&
  process.env.NODE_DEBUG &&
  /\bsemver\b/i.test(process.env.NODE_DEBUG)
) ? (...args) => console.error('SEMVER', ...args)
  : () => {};

var debug_1 = debug;

var re_1 = createCommonjsModule(function (module, exports) {
const { MAX_SAFE_COMPONENT_LENGTH } = constants;

exports = module.exports = {};

// The actual regexps go on exports.re
const re = exports.re = [];
const src = exports.src = [];
const t = exports.t = {};
let R = 0;

const createToken = (name, value, isGlobal) => {
  const index = R++;
  debug_1(index, value);
  t[name] = index;
  src[index] = value;
  re[index] = new RegExp(value, isGlobal ? 'g' : undefined);
};

// The following Regular Expressions can be used for tokenizing,
// validating, and parsing SemVer version strings.

// ## Numeric Identifier
// A single `0`, or a non-zero digit followed by zero or more digits.

createToken('NUMERICIDENTIFIER', '0|[1-9]\\d*');
createToken('NUMERICIDENTIFIERLOOSE', '[0-9]+');

// ## Non-numeric Identifier
// Zero or more digits, followed by a letter or hyphen, and then zero or
// more letters, digits, or hyphens.

createToken('NONNUMERICIDENTIFIER', '\\d*[a-zA-Z-][a-zA-Z0-9-]*');

// ## Main Version
// Three dot-separated numeric identifiers.

createToken('MAINVERSION', `(${src[t.NUMERICIDENTIFIER]})\\.` +
                   `(${src[t.NUMERICIDENTIFIER]})\\.` +
                   `(${src[t.NUMERICIDENTIFIER]})`);

createToken('MAINVERSIONLOOSE', `(${src[t.NUMERICIDENTIFIERLOOSE]})\\.` +
                        `(${src[t.NUMERICIDENTIFIERLOOSE]})\\.` +
                        `(${src[t.NUMERICIDENTIFIERLOOSE]})`);

// ## Pre-release Version Identifier
// A numeric identifier, or a non-numeric identifier.

createToken('PRERELEASEIDENTIFIER', `(?:${src[t.NUMERICIDENTIFIER]
}|${src[t.NONNUMERICIDENTIFIER]})`);

createToken('PRERELEASEIDENTIFIERLOOSE', `(?:${src[t.NUMERICIDENTIFIERLOOSE]
}|${src[t.NONNUMERICIDENTIFIER]})`);

// ## Pre-release Version
// Hyphen, followed by one or more dot-separated pre-release version
// identifiers.

createToken('PRERELEASE', `(?:-(${src[t.PRERELEASEIDENTIFIER]
}(?:\\.${src[t.PRERELEASEIDENTIFIER]})*))`);

createToken('PRERELEASELOOSE', `(?:-?(${src[t.PRERELEASEIDENTIFIERLOOSE]
}(?:\\.${src[t.PRERELEASEIDENTIFIERLOOSE]})*))`);

// ## Build Metadata Identifier
// Any combination of digits, letters, or hyphens.

createToken('BUILDIDENTIFIER', '[0-9A-Za-z-]+');

// ## Build Metadata
// Plus sign, followed by one or more period-separated build metadata
// identifiers.

createToken('BUILD', `(?:\\+(${src[t.BUILDIDENTIFIER]
}(?:\\.${src[t.BUILDIDENTIFIER]})*))`);

// ## Full Version String
// A main version, followed optionally by a pre-release version and
// build metadata.

// Note that the only major, minor, patch, and pre-release sections of
// the version string are capturing groups.  The build metadata is not a
// capturing group, because it should not ever be used in version
// comparison.

createToken('FULLPLAIN', `v?${src[t.MAINVERSION]
}${src[t.PRERELEASE]}?${
  src[t.BUILD]}?`);

createToken('FULL', `^${src[t.FULLPLAIN]}$`);

// like full, but allows v1.2.3 and =1.2.3, which people do sometimes.
// also, 1.0.0alpha1 (prerelease without the hyphen) which is pretty
// common in the npm registry.
createToken('LOOSEPLAIN', `[v=\\s]*${src[t.MAINVERSIONLOOSE]
}${src[t.PRERELEASELOOSE]}?${
  src[t.BUILD]}?`);

createToken('LOOSE', `^${src[t.LOOSEPLAIN]}$`);

createToken('GTLT', '((?:<|>)?=?)');

// Something like "2.*" or "1.2.x".
// Note that "x.x" is a valid xRange identifer, meaning "any version"
// Only the first item is strictly required.
createToken('XRANGEIDENTIFIERLOOSE', `${src[t.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`);
createToken('XRANGEIDENTIFIER', `${src[t.NUMERICIDENTIFIER]}|x|X|\\*`);

createToken('XRANGEPLAIN', `[v=\\s]*(${src[t.XRANGEIDENTIFIER]})` +
                   `(?:\\.(${src[t.XRANGEIDENTIFIER]})` +
                   `(?:\\.(${src[t.XRANGEIDENTIFIER]})` +
                   `(?:${src[t.PRERELEASE]})?${
                     src[t.BUILD]}?` +
                   `)?)?`);

createToken('XRANGEPLAINLOOSE', `[v=\\s]*(${src[t.XRANGEIDENTIFIERLOOSE]})` +
                        `(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})` +
                        `(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})` +
                        `(?:${src[t.PRERELEASELOOSE]})?${
                          src[t.BUILD]}?` +
                        `)?)?`);

createToken('XRANGE', `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAIN]}$`);
createToken('XRANGELOOSE', `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAINLOOSE]}$`);

// Coercion.
// Extract anything that could conceivably be a part of a valid semver
createToken('COERCE', `${'(^|[^\\d])' +
              '(\\d{1,'}${MAX_SAFE_COMPONENT_LENGTH}})` +
              `(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?` +
              `(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?` +
              `(?:$|[^\\d])`);
createToken('COERCERTL', src[t.COERCE], true);

// Tilde ranges.
// Meaning is "reasonably at or greater than"
createToken('LONETILDE', '(?:~>?)');

createToken('TILDETRIM', `(\\s*)${src[t.LONETILDE]}\\s+`, true);
exports.tildeTrimReplace = '$1~';

createToken('TILDE', `^${src[t.LONETILDE]}${src[t.XRANGEPLAIN]}$`);
createToken('TILDELOOSE', `^${src[t.LONETILDE]}${src[t.XRANGEPLAINLOOSE]}$`);

// Caret ranges.
// Meaning is "at least and backwards compatible with"
createToken('LONECARET', '(?:\\^)');

createToken('CARETTRIM', `(\\s*)${src[t.LONECARET]}\\s+`, true);
exports.caretTrimReplace = '$1^';

createToken('CARET', `^${src[t.LONECARET]}${src[t.XRANGEPLAIN]}$`);
createToken('CARETLOOSE', `^${src[t.LONECARET]}${src[t.XRANGEPLAINLOOSE]}$`);

// A simple gt/lt/eq thing, or just "" to indicate "any version"
createToken('COMPARATORLOOSE', `^${src[t.GTLT]}\\s*(${src[t.LOOSEPLAIN]})$|^$`);
createToken('COMPARATOR', `^${src[t.GTLT]}\\s*(${src[t.FULLPLAIN]})$|^$`);

// An expression to strip any whitespace between the gtlt and the thing
// it modifies, so that `> 1.2.3` ==> `>1.2.3`
createToken('COMPARATORTRIM', `(\\s*)${src[t.GTLT]
}\\s*(${src[t.LOOSEPLAIN]}|${src[t.XRANGEPLAIN]})`, true);
exports.comparatorTrimReplace = '$1$2$3';

// Something like `1.2.3 - 1.2.4`
// Note that these all use the loose form, because they'll be
// checked against either the strict or loose comparator form
// later.
createToken('HYPHENRANGE', `^\\s*(${src[t.XRANGEPLAIN]})` +
                   `\\s+-\\s+` +
                   `(${src[t.XRANGEPLAIN]})` +
                   `\\s*$`);

createToken('HYPHENRANGELOOSE', `^\\s*(${src[t.XRANGEPLAINLOOSE]})` +
                        `\\s+-\\s+` +
                        `(${src[t.XRANGEPLAINLOOSE]})` +
                        `\\s*$`);

// Star ranges basically just allow anything at all.
createToken('STAR', '(<|>)?=?\\s*\\*');
// >=0.0.0 is like a star
createToken('GTE0', '^\\s*>=\\s*0\.0\.0\\s*$');
createToken('GTE0PRE', '^\\s*>=\\s*0\.0\.0-0\\s*$');
});

// parse out just the options we care about so we always get a consistent
// obj with keys in a consistent order.
const opts = ['includePrerelease', 'loose', 'rtl'];
const parseOptions = options =>
  !options ? {}
  : typeof options !== 'object' ? { loose: true }
  : opts.filter(k => options[k]).reduce((options, k) => {
    options[k] = true;
    return options
  }, {});
var parseOptions_1 = parseOptions;

const numeric = /^[0-9]+$/;
const compareIdentifiers = (a, b) => {
  const anum = numeric.test(a);
  const bnum = numeric.test(b);

  if (anum && bnum) {
    a = +a;
    b = +b;
  }

  return a === b ? 0
    : (anum && !bnum) ? -1
    : (bnum && !anum) ? 1
    : a < b ? -1
    : 1
};

const rcompareIdentifiers = (a, b) => compareIdentifiers(b, a);

var identifiers = {
  compareIdentifiers,
  rcompareIdentifiers
};

const { MAX_LENGTH: MAX_LENGTH$1, MAX_SAFE_INTEGER: MAX_SAFE_INTEGER$1 } = constants;
const { re, t } = re_1;


const { compareIdentifiers: compareIdentifiers$1 } = identifiers;
class SemVer {
  constructor (version, options) {
    options = parseOptions_1(options);

    if (version instanceof SemVer) {
      if (version.loose === !!options.loose &&
          version.includePrerelease === !!options.includePrerelease) {
        return version
      } else {
        version = version.version;
      }
    } else if (typeof version !== 'string') {
      throw new TypeError(`Invalid Version: ${version}`)
    }

    if (version.length > MAX_LENGTH$1) {
      throw new TypeError(
        `version is longer than ${MAX_LENGTH$1} characters`
      )
    }

    debug_1('SemVer', version, options);
    this.options = options;
    this.loose = !!options.loose;
    // this isn't actually relevant for versions, but keep it so that we
    // don't run into trouble passing this.options around.
    this.includePrerelease = !!options.includePrerelease;

    const m = version.trim().match(options.loose ? re[t.LOOSE] : re[t.FULL]);

    if (!m) {
      throw new TypeError(`Invalid Version: ${version}`)
    }

    this.raw = version;

    // these are actually numbers
    this.major = +m[1];
    this.minor = +m[2];
    this.patch = +m[3];

    if (this.major > MAX_SAFE_INTEGER$1 || this.major < 0) {
      throw new TypeError('Invalid major version')
    }

    if (this.minor > MAX_SAFE_INTEGER$1 || this.minor < 0) {
      throw new TypeError('Invalid minor version')
    }

    if (this.patch > MAX_SAFE_INTEGER$1 || this.patch < 0) {
      throw new TypeError('Invalid patch version')
    }

    // numberify any prerelease numeric ids
    if (!m[4]) {
      this.prerelease = [];
    } else {
      this.prerelease = m[4].split('.').map((id) => {
        if (/^[0-9]+$/.test(id)) {
          const num = +id;
          if (num >= 0 && num < MAX_SAFE_INTEGER$1) {
            return num
          }
        }
        return id
      });
    }

    this.build = m[5] ? m[5].split('.') : [];
    this.format();
  }

  format () {
    this.version = `${this.major}.${this.minor}.${this.patch}`;
    if (this.prerelease.length) {
      this.version += `-${this.prerelease.join('.')}`;
    }
    return this.version
  }

  toString () {
    return this.version
  }

  compare (other) {
    debug_1('SemVer.compare', this.version, this.options, other);
    if (!(other instanceof SemVer)) {
      if (typeof other === 'string' && other === this.version) {
        return 0
      }
      other = new SemVer(other, this.options);
    }

    if (other.version === this.version) {
      return 0
    }

    return this.compareMain(other) || this.comparePre(other)
  }

  compareMain (other) {
    if (!(other instanceof SemVer)) {
      other = new SemVer(other, this.options);
    }

    return (
      compareIdentifiers$1(this.major, other.major) ||
      compareIdentifiers$1(this.minor, other.minor) ||
      compareIdentifiers$1(this.patch, other.patch)
    )
  }

  comparePre (other) {
    if (!(other instanceof SemVer)) {
      other = new SemVer(other, this.options);
    }

    // NOT having a prerelease is > having one
    if (this.prerelease.length && !other.prerelease.length) {
      return -1
    } else if (!this.prerelease.length && other.prerelease.length) {
      return 1
    } else if (!this.prerelease.length && !other.prerelease.length) {
      return 0
    }

    let i = 0;
    do {
      const a = this.prerelease[i];
      const b = other.prerelease[i];
      debug_1('prerelease compare', i, a, b);
      if (a === undefined && b === undefined) {
        return 0
      } else if (b === undefined) {
        return 1
      } else if (a === undefined) {
        return -1
      } else if (a === b) {
        continue
      } else {
        return compareIdentifiers$1(a, b)
      }
    } while (++i)
  }

  compareBuild (other) {
    if (!(other instanceof SemVer)) {
      other = new SemVer(other, this.options);
    }

    let i = 0;
    do {
      const a = this.build[i];
      const b = other.build[i];
      debug_1('prerelease compare', i, a, b);
      if (a === undefined && b === undefined) {
        return 0
      } else if (b === undefined) {
        return 1
      } else if (a === undefined) {
        return -1
      } else if (a === b) {
        continue
      } else {
        return compareIdentifiers$1(a, b)
      }
    } while (++i)
  }

  // preminor will bump the version up to the next minor release, and immediately
  // down to pre-release. premajor and prepatch work the same way.
  inc (release, identifier) {
    switch (release) {
      case 'premajor':
        this.prerelease.length = 0;
        this.patch = 0;
        this.minor = 0;
        this.major++;
        this.inc('pre', identifier);
        break
      case 'preminor':
        this.prerelease.length = 0;
        this.patch = 0;
        this.minor++;
        this.inc('pre', identifier);
        break
      case 'prepatch':
        // If this is already a prerelease, it will bump to the next version
        // drop any prereleases that might already exist, since they are not
        // relevant at this point.
        this.prerelease.length = 0;
        this.inc('patch', identifier);
        this.inc('pre', identifier);
        break
      // If the input is a non-prerelease version, this acts the same as
      // prepatch.
      case 'prerelease':
        if (this.prerelease.length === 0) {
          this.inc('patch', identifier);
        }
        this.inc('pre', identifier);
        break

      case 'major':
        // If this is a pre-major version, bump up to the same major version.
        // Otherwise increment major.
        // 1.0.0-5 bumps to 1.0.0
        // 1.1.0 bumps to 2.0.0
        if (
          this.minor !== 0 ||
          this.patch !== 0 ||
          this.prerelease.length === 0
        ) {
          this.major++;
        }
        this.minor = 0;
        this.patch = 0;
        this.prerelease = [];
        break
      case 'minor':
        // If this is a pre-minor version, bump up to the same minor version.
        // Otherwise increment minor.
        // 1.2.0-5 bumps to 1.2.0
        // 1.2.1 bumps to 1.3.0
        if (this.patch !== 0 || this.prerelease.length === 0) {
          this.minor++;
        }
        this.patch = 0;
        this.prerelease = [];
        break
      case 'patch':
        // If this is not a pre-release version, it will increment the patch.
        // If it is a pre-release it will bump up to the same patch version.
        // 1.2.0-5 patches to 1.2.0
        // 1.2.0 patches to 1.2.1
        if (this.prerelease.length === 0) {
          this.patch++;
        }
        this.prerelease = [];
        break
      // This probably shouldn't be used publicly.
      // 1.0.0 'pre' would become 1.0.0-0 which is the wrong direction.
      case 'pre':
        if (this.prerelease.length === 0) {
          this.prerelease = [0];
        } else {
          let i = this.prerelease.length;
          while (--i >= 0) {
            if (typeof this.prerelease[i] === 'number') {
              this.prerelease[i]++;
              i = -2;
            }
          }
          if (i === -1) {
            // didn't increment anything
            this.prerelease.push(0);
          }
        }
        if (identifier) {
          // 1.2.0-beta.1 bumps to 1.2.0-beta.2,
          // 1.2.0-beta.fooblz or 1.2.0-beta bumps to 1.2.0-beta.0
          if (this.prerelease[0] === identifier) {
            if (isNaN(this.prerelease[1])) {
              this.prerelease = [identifier, 0];
            }
          } else {
            this.prerelease = [identifier, 0];
          }
        }
        break

      default:
        throw new Error(`invalid increment argument: ${release}`)
    }
    this.format();
    this.raw = this.version;
    return this
  }
}

var semver = SemVer;

const {MAX_LENGTH: MAX_LENGTH$2} = constants;
const { re: re$1, t: t$1 } = re_1;



const parse = (version, options) => {
  options = parseOptions_1(options);

  if (version instanceof semver) {
    return version
  }

  if (typeof version !== 'string') {
    return null
  }

  if (version.length > MAX_LENGTH$2) {
    return null
  }

  const r = options.loose ? re$1[t$1.LOOSE] : re$1[t$1.FULL];
  if (!r.test(version)) {
    return null
  }

  try {
    return new semver(version, options)
  } catch (er) {
    return null
  }
};

var parse_1 = parse;

const valid = (version, options) => {
  const v = parse_1(version, options);
  return v ? v.version : null
};
var valid_1 = valid;

const clean = (version, options) => {
  const s = parse_1(version.trim().replace(/^[=v]+/, ''), options);
  return s ? s.version : null
};
var clean_1 = clean;

const inc = (version, release, options, identifier) => {
  if (typeof (options) === 'string') {
    identifier = options;
    options = undefined;
  }

  try {
    return new semver(version, options).inc(release, identifier).version
  } catch (er) {
    return null
  }
};
var inc_1 = inc;

const compare = (a, b, loose) =>
  new semver(a, loose).compare(new semver(b, loose));

var compare_1 = compare;

const eq = (a, b, loose) => compare_1(a, b, loose) === 0;
var eq_1 = eq;

const diff = (version1, version2) => {
  if (eq_1(version1, version2)) {
    return null
  } else {
    const v1 = parse_1(version1);
    const v2 = parse_1(version2);
    const hasPre = v1.prerelease.length || v2.prerelease.length;
    const prefix = hasPre ? 'pre' : '';
    const defaultResult = hasPre ? 'prerelease' : '';
    for (const key in v1) {
      if (key === 'major' || key === 'minor' || key === 'patch') {
        if (v1[key] !== v2[key]) {
          return prefix + key
        }
      }
    }
    return defaultResult // may be undefined
  }
};
var diff_1 = diff;

const major = (a, loose) => new semver(a, loose).major;
var major_1 = major;

const minor = (a, loose) => new semver(a, loose).minor;
var minor_1 = minor;

const patch = (a, loose) => new semver(a, loose).patch;
var patch_1 = patch;

const prerelease = (version, options) => {
  const parsed = parse_1(version, options);
  return (parsed && parsed.prerelease.length) ? parsed.prerelease : null
};
var prerelease_1 = prerelease;

const rcompare = (a, b, loose) => compare_1(b, a, loose);
var rcompare_1 = rcompare;

const compareLoose = (a, b) => compare_1(a, b, true);
var compareLoose_1 = compareLoose;

const compareBuild = (a, b, loose) => {
  const versionA = new semver(a, loose);
  const versionB = new semver(b, loose);
  return versionA.compare(versionB) || versionA.compareBuild(versionB)
};
var compareBuild_1 = compareBuild;

const sort = (list, loose) => list.sort((a, b) => compareBuild_1(a, b, loose));
var sort_1 = sort;

const rsort = (list, loose) => list.sort((a, b) => compareBuild_1(b, a, loose));
var rsort_1 = rsort;

const gt = (a, b, loose) => compare_1(a, b, loose) > 0;
var gt_1 = gt;

const lt = (a, b, loose) => compare_1(a, b, loose) < 0;
var lt_1 = lt;

const neq = (a, b, loose) => compare_1(a, b, loose) !== 0;
var neq_1 = neq;

const gte = (a, b, loose) => compare_1(a, b, loose) >= 0;
var gte_1 = gte;

const lte = (a, b, loose) => compare_1(a, b, loose) <= 0;
var lte_1 = lte;

const cmp = (a, op, b, loose) => {
  switch (op) {
    case '===':
      if (typeof a === 'object')
        a = a.version;
      if (typeof b === 'object')
        b = b.version;
      return a === b

    case '!==':
      if (typeof a === 'object')
        a = a.version;
      if (typeof b === 'object')
        b = b.version;
      return a !== b

    case '':
    case '=':
    case '==':
      return eq_1(a, b, loose)

    case '!=':
      return neq_1(a, b, loose)

    case '>':
      return gt_1(a, b, loose)

    case '>=':
      return gte_1(a, b, loose)

    case '<':
      return lt_1(a, b, loose)

    case '<=':
      return lte_1(a, b, loose)

    default:
      throw new TypeError(`Invalid operator: ${op}`)
  }
};
var cmp_1 = cmp;

const {re: re$2, t: t$2} = re_1;

const coerce = (version, options) => {
  if (version instanceof semver) {
    return version
  }

  if (typeof version === 'number') {
    version = String(version);
  }

  if (typeof version !== 'string') {
    return null
  }

  options = options || {};

  let match = null;
  if (!options.rtl) {
    match = version.match(re$2[t$2.COERCE]);
  } else {
    // Find the right-most coercible string that does not share
    // a terminus with a more left-ward coercible string.
    // Eg, '1.2.3.4' wants to coerce '2.3.4', not '3.4' or '4'
    //
    // Walk through the string checking with a /g regexp
    // Manually set the index so as to pick up overlapping matches.
    // Stop when we get a match that ends at the string end, since no
    // coercible string can be more right-ward without the same terminus.
    let next;
    while ((next = re$2[t$2.COERCERTL].exec(version)) &&
        (!match || match.index + match[0].length !== version.length)
    ) {
      if (!match ||
            next.index + next[0].length !== match.index + match[0].length) {
        match = next;
      }
      re$2[t$2.COERCERTL].lastIndex = next.index + next[1].length + next[2].length;
    }
    // leave it in a clean state
    re$2[t$2.COERCERTL].lastIndex = -1;
  }

  if (match === null)
    return null

  return parse_1(`${match[2]}.${match[3] || '0'}.${match[4] || '0'}`, options)
};
var coerce_1 = coerce;

var iterator = function (Yallist) {
  Yallist.prototype[Symbol.iterator] = function* () {
    for (let walker = this.head; walker; walker = walker.next) {
      yield walker.value;
    }
  };
};

var yallist = Yallist;

Yallist.Node = Node;
Yallist.create = Yallist;

function Yallist (list) {
  var self = this;
  if (!(self instanceof Yallist)) {
    self = new Yallist();
  }

  self.tail = null;
  self.head = null;
  self.length = 0;

  if (list && typeof list.forEach === 'function') {
    list.forEach(function (item) {
      self.push(item);
    });
  } else if (arguments.length > 0) {
    for (var i = 0, l = arguments.length; i < l; i++) {
      self.push(arguments[i]);
    }
  }

  return self
}

Yallist.prototype.removeNode = function (node) {
  if (node.list !== this) {
    throw new Error('removing node which does not belong to this list')
  }

  var next = node.next;
  var prev = node.prev;

  if (next) {
    next.prev = prev;
  }

  if (prev) {
    prev.next = next;
  }

  if (node === this.head) {
    this.head = next;
  }
  if (node === this.tail) {
    this.tail = prev;
  }

  node.list.length--;
  node.next = null;
  node.prev = null;
  node.list = null;

  return next
};

Yallist.prototype.unshiftNode = function (node) {
  if (node === this.head) {
    return
  }

  if (node.list) {
    node.list.removeNode(node);
  }

  var head = this.head;
  node.list = this;
  node.next = head;
  if (head) {
    head.prev = node;
  }

  this.head = node;
  if (!this.tail) {
    this.tail = node;
  }
  this.length++;
};

Yallist.prototype.pushNode = function (node) {
  if (node === this.tail) {
    return
  }

  if (node.list) {
    node.list.removeNode(node);
  }

  var tail = this.tail;
  node.list = this;
  node.prev = tail;
  if (tail) {
    tail.next = node;
  }

  this.tail = node;
  if (!this.head) {
    this.head = node;
  }
  this.length++;
};

Yallist.prototype.push = function () {
  for (var i = 0, l = arguments.length; i < l; i++) {
    push(this, arguments[i]);
  }
  return this.length
};

Yallist.prototype.unshift = function () {
  for (var i = 0, l = arguments.length; i < l; i++) {
    unshift(this, arguments[i]);
  }
  return this.length
};

Yallist.prototype.pop = function () {
  if (!this.tail) {
    return undefined
  }

  var res = this.tail.value;
  this.tail = this.tail.prev;
  if (this.tail) {
    this.tail.next = null;
  } else {
    this.head = null;
  }
  this.length--;
  return res
};

Yallist.prototype.shift = function () {
  if (!this.head) {
    return undefined
  }

  var res = this.head.value;
  this.head = this.head.next;
  if (this.head) {
    this.head.prev = null;
  } else {
    this.tail = null;
  }
  this.length--;
  return res
};

Yallist.prototype.forEach = function (fn, thisp) {
  thisp = thisp || this;
  for (var walker = this.head, i = 0; walker !== null; i++) {
    fn.call(thisp, walker.value, i, this);
    walker = walker.next;
  }
};

Yallist.prototype.forEachReverse = function (fn, thisp) {
  thisp = thisp || this;
  for (var walker = this.tail, i = this.length - 1; walker !== null; i--) {
    fn.call(thisp, walker.value, i, this);
    walker = walker.prev;
  }
};

Yallist.prototype.get = function (n) {
  for (var i = 0, walker = this.head; walker !== null && i < n; i++) {
    // abort out of the list early if we hit a cycle
    walker = walker.next;
  }
  if (i === n && walker !== null) {
    return walker.value
  }
};

Yallist.prototype.getReverse = function (n) {
  for (var i = 0, walker = this.tail; walker !== null && i < n; i++) {
    // abort out of the list early if we hit a cycle
    walker = walker.prev;
  }
  if (i === n && walker !== null) {
    return walker.value
  }
};

Yallist.prototype.map = function (fn, thisp) {
  thisp = thisp || this;
  var res = new Yallist();
  for (var walker = this.head; walker !== null;) {
    res.push(fn.call(thisp, walker.value, this));
    walker = walker.next;
  }
  return res
};

Yallist.prototype.mapReverse = function (fn, thisp) {
  thisp = thisp || this;
  var res = new Yallist();
  for (var walker = this.tail; walker !== null;) {
    res.push(fn.call(thisp, walker.value, this));
    walker = walker.prev;
  }
  return res
};

Yallist.prototype.reduce = function (fn, initial) {
  var acc;
  var walker = this.head;
  if (arguments.length > 1) {
    acc = initial;
  } else if (this.head) {
    walker = this.head.next;
    acc = this.head.value;
  } else {
    throw new TypeError('Reduce of empty list with no initial value')
  }

  for (var i = 0; walker !== null; i++) {
    acc = fn(acc, walker.value, i);
    walker = walker.next;
  }

  return acc
};

Yallist.prototype.reduceReverse = function (fn, initial) {
  var acc;
  var walker = this.tail;
  if (arguments.length > 1) {
    acc = initial;
  } else if (this.tail) {
    walker = this.tail.prev;
    acc = this.tail.value;
  } else {
    throw new TypeError('Reduce of empty list with no initial value')
  }

  for (var i = this.length - 1; walker !== null; i--) {
    acc = fn(acc, walker.value, i);
    walker = walker.prev;
  }

  return acc
};

Yallist.prototype.toArray = function () {
  var arr = new Array(this.length);
  for (var i = 0, walker = this.head; walker !== null; i++) {
    arr[i] = walker.value;
    walker = walker.next;
  }
  return arr
};

Yallist.prototype.toArrayReverse = function () {
  var arr = new Array(this.length);
  for (var i = 0, walker = this.tail; walker !== null; i++) {
    arr[i] = walker.value;
    walker = walker.prev;
  }
  return arr
};

Yallist.prototype.slice = function (from, to) {
  to = to || this.length;
  if (to < 0) {
    to += this.length;
  }
  from = from || 0;
  if (from < 0) {
    from += this.length;
  }
  var ret = new Yallist();
  if (to < from || to < 0) {
    return ret
  }
  if (from < 0) {
    from = 0;
  }
  if (to > this.length) {
    to = this.length;
  }
  for (var i = 0, walker = this.head; walker !== null && i < from; i++) {
    walker = walker.next;
  }
  for (; walker !== null && i < to; i++, walker = walker.next) {
    ret.push(walker.value);
  }
  return ret
};

Yallist.prototype.sliceReverse = function (from, to) {
  to = to || this.length;
  if (to < 0) {
    to += this.length;
  }
  from = from || 0;
  if (from < 0) {
    from += this.length;
  }
  var ret = new Yallist();
  if (to < from || to < 0) {
    return ret
  }
  if (from < 0) {
    from = 0;
  }
  if (to > this.length) {
    to = this.length;
  }
  for (var i = this.length, walker = this.tail; walker !== null && i > to; i--) {
    walker = walker.prev;
  }
  for (; walker !== null && i > from; i--, walker = walker.prev) {
    ret.push(walker.value);
  }
  return ret
};

Yallist.prototype.splice = function (start, deleteCount, ...nodes) {
  if (start > this.length) {
    start = this.length - 1;
  }
  if (start < 0) {
    start = this.length + start;
  }

  for (var i = 0, walker = this.head; walker !== null && i < start; i++) {
    walker = walker.next;
  }

  var ret = [];
  for (var i = 0; walker && i < deleteCount; i++) {
    ret.push(walker.value);
    walker = this.removeNode(walker);
  }
  if (walker === null) {
    walker = this.tail;
  }

  if (walker !== this.head && walker !== this.tail) {
    walker = walker.prev;
  }

  for (var i = 0; i < nodes.length; i++) {
    walker = insert(this, walker, nodes[i]);
  }
  return ret;
};

Yallist.prototype.reverse = function () {
  var head = this.head;
  var tail = this.tail;
  for (var walker = head; walker !== null; walker = walker.prev) {
    var p = walker.prev;
    walker.prev = walker.next;
    walker.next = p;
  }
  this.head = tail;
  this.tail = head;
  return this
};

function insert (self, node, value) {
  var inserted = node === self.head ?
    new Node(value, null, node, self) :
    new Node(value, node, node.next, self);

  if (inserted.next === null) {
    self.tail = inserted;
  }
  if (inserted.prev === null) {
    self.head = inserted;
  }

  self.length++;

  return inserted
}

function push (self, item) {
  self.tail = new Node(item, self.tail, null, self);
  if (!self.head) {
    self.head = self.tail;
  }
  self.length++;
}

function unshift (self, item) {
  self.head = new Node(item, null, self.head, self);
  if (!self.tail) {
    self.tail = self.head;
  }
  self.length++;
}

function Node (value, prev, next, list) {
  if (!(this instanceof Node)) {
    return new Node(value, prev, next, list)
  }

  this.list = list;
  this.value = value;

  if (prev) {
    prev.next = this;
    this.prev = prev;
  } else {
    this.prev = null;
  }

  if (next) {
    next.prev = this;
    this.next = next;
  } else {
    this.next = null;
  }
}

try {
  // add if support for Symbol.iterator is present
  iterator(Yallist);
} catch (er) {}

// A linked list to keep track of recently-used-ness


const MAX = Symbol('max');
const LENGTH = Symbol('length');
const LENGTH_CALCULATOR = Symbol('lengthCalculator');
const ALLOW_STALE = Symbol('allowStale');
const MAX_AGE = Symbol('maxAge');
const DISPOSE = Symbol('dispose');
const NO_DISPOSE_ON_SET = Symbol('noDisposeOnSet');
const LRU_LIST = Symbol('lruList');
const CACHE = Symbol('cache');
const UPDATE_AGE_ON_GET = Symbol('updateAgeOnGet');

const naiveLength = () => 1;

// lruList is a yallist where the head is the youngest
// item, and the tail is the oldest.  the list contains the Hit
// objects as the entries.
// Each Hit object has a reference to its Yallist.Node.  This
// never changes.
//
// cache is a Map (or PseudoMap) that matches the keys to
// the Yallist.Node object.
class LRUCache {
  constructor (options) {
    if (typeof options === 'number')
      options = { max: options };

    if (!options)
      options = {};

    if (options.max && (typeof options.max !== 'number' || options.max < 0))
      throw new TypeError('max must be a non-negative number')
    // Kind of weird to have a default max of Infinity, but oh well.
    const max = this[MAX] = options.max || Infinity;

    const lc = options.length || naiveLength;
    this[LENGTH_CALCULATOR] = (typeof lc !== 'function') ? naiveLength : lc;
    this[ALLOW_STALE] = options.stale || false;
    if (options.maxAge && typeof options.maxAge !== 'number')
      throw new TypeError('maxAge must be a number')
    this[MAX_AGE] = options.maxAge || 0;
    this[DISPOSE] = options.dispose;
    this[NO_DISPOSE_ON_SET] = options.noDisposeOnSet || false;
    this[UPDATE_AGE_ON_GET] = options.updateAgeOnGet || false;
    this.reset();
  }

  // resize the cache when the max changes.
  set max (mL) {
    if (typeof mL !== 'number' || mL < 0)
      throw new TypeError('max must be a non-negative number')

    this[MAX] = mL || Infinity;
    trim(this);
  }
  get max () {
    return this[MAX]
  }

  set allowStale (allowStale) {
    this[ALLOW_STALE] = !!allowStale;
  }
  get allowStale () {
    return this[ALLOW_STALE]
  }

  set maxAge (mA) {
    if (typeof mA !== 'number')
      throw new TypeError('maxAge must be a non-negative number')

    this[MAX_AGE] = mA;
    trim(this);
  }
  get maxAge () {
    return this[MAX_AGE]
  }

  // resize the cache when the lengthCalculator changes.
  set lengthCalculator (lC) {
    if (typeof lC !== 'function')
      lC = naiveLength;

    if (lC !== this[LENGTH_CALCULATOR]) {
      this[LENGTH_CALCULATOR] = lC;
      this[LENGTH] = 0;
      this[LRU_LIST].forEach(hit => {
        hit.length = this[LENGTH_CALCULATOR](hit.value, hit.key);
        this[LENGTH] += hit.length;
      });
    }
    trim(this);
  }
  get lengthCalculator () { return this[LENGTH_CALCULATOR] }

  get length () { return this[LENGTH] }
  get itemCount () { return this[LRU_LIST].length }

  rforEach (fn, thisp) {
    thisp = thisp || this;
    for (let walker = this[LRU_LIST].tail; walker !== null;) {
      const prev = walker.prev;
      forEachStep(this, fn, walker, thisp);
      walker = prev;
    }
  }

  forEach (fn, thisp) {
    thisp = thisp || this;
    for (let walker = this[LRU_LIST].head; walker !== null;) {
      const next = walker.next;
      forEachStep(this, fn, walker, thisp);
      walker = next;
    }
  }

  keys () {
    return this[LRU_LIST].toArray().map(k => k.key)
  }

  values () {
    return this[LRU_LIST].toArray().map(k => k.value)
  }

  reset () {
    if (this[DISPOSE] &&
        this[LRU_LIST] &&
        this[LRU_LIST].length) {
      this[LRU_LIST].forEach(hit => this[DISPOSE](hit.key, hit.value));
    }

    this[CACHE] = new Map(); // hash of items by key
    this[LRU_LIST] = new yallist(); // list of items in order of use recency
    this[LENGTH] = 0; // length of items in the list
  }

  dump () {
    return this[LRU_LIST].map(hit =>
      isStale(this, hit) ? false : {
        k: hit.key,
        v: hit.value,
        e: hit.now + (hit.maxAge || 0)
      }).toArray().filter(h => h)
  }

  dumpLru () {
    return this[LRU_LIST]
  }

  set (key, value, maxAge) {
    maxAge = maxAge || this[MAX_AGE];

    if (maxAge && typeof maxAge !== 'number')
      throw new TypeError('maxAge must be a number')

    const now = maxAge ? Date.now() : 0;
    const len = this[LENGTH_CALCULATOR](value, key);

    if (this[CACHE].has(key)) {
      if (len > this[MAX]) {
        del(this, this[CACHE].get(key));
        return false
      }

      const node = this[CACHE].get(key);
      const item = node.value;

      // dispose of the old one before overwriting
      // split out into 2 ifs for better coverage tracking
      if (this[DISPOSE]) {
        if (!this[NO_DISPOSE_ON_SET])
          this[DISPOSE](key, item.value);
      }

      item.now = now;
      item.maxAge = maxAge;
      item.value = value;
      this[LENGTH] += len - item.length;
      item.length = len;
      this.get(key);
      trim(this);
      return true
    }

    const hit = new Entry(key, value, len, now, maxAge);

    // oversized objects fall out of cache automatically.
    if (hit.length > this[MAX]) {
      if (this[DISPOSE])
        this[DISPOSE](key, value);

      return false
    }

    this[LENGTH] += hit.length;
    this[LRU_LIST].unshift(hit);
    this[CACHE].set(key, this[LRU_LIST].head);
    trim(this);
    return true
  }

  has (key) {
    if (!this[CACHE].has(key)) return false
    const hit = this[CACHE].get(key).value;
    return !isStale(this, hit)
  }

  get (key) {
    return get(this, key, true)
  }

  peek (key) {
    return get(this, key, false)
  }

  pop () {
    const node = this[LRU_LIST].tail;
    if (!node)
      return null

    del(this, node);
    return node.value
  }

  del (key) {
    del(this, this[CACHE].get(key));
  }

  load (arr) {
    // reset the cache
    this.reset();

    const now = Date.now();
    // A previous serialized cache has the most recent items first
    for (let l = arr.length - 1; l >= 0; l--) {
      const hit = arr[l];
      const expiresAt = hit.e || 0;
      if (expiresAt === 0)
        // the item was created without expiration in a non aged cache
        this.set(hit.k, hit.v);
      else {
        const maxAge = expiresAt - now;
        // dont add already expired items
        if (maxAge > 0) {
          this.set(hit.k, hit.v, maxAge);
        }
      }
    }
  }

  prune () {
    this[CACHE].forEach((value, key) => get(this, key, false));
  }
}

const get = (self, key, doUse) => {
  const node = self[CACHE].get(key);
  if (node) {
    const hit = node.value;
    if (isStale(self, hit)) {
      del(self, node);
      if (!self[ALLOW_STALE])
        return undefined
    } else {
      if (doUse) {
        if (self[UPDATE_AGE_ON_GET])
          node.value.now = Date.now();
        self[LRU_LIST].unshiftNode(node);
      }
    }
    return hit.value
  }
};

const isStale = (self, hit) => {
  if (!hit || (!hit.maxAge && !self[MAX_AGE]))
    return false

  const diff = Date.now() - hit.now;
  return hit.maxAge ? diff > hit.maxAge
    : self[MAX_AGE] && (diff > self[MAX_AGE])
};

const trim = self => {
  if (self[LENGTH] > self[MAX]) {
    for (let walker = self[LRU_LIST].tail;
      self[LENGTH] > self[MAX] && walker !== null;) {
      // We know that we're about to delete this one, and also
      // what the next least recently used key will be, so just
      // go ahead and set it now.
      const prev = walker.prev;
      del(self, walker);
      walker = prev;
    }
  }
};

const del = (self, node) => {
  if (node) {
    const hit = node.value;
    if (self[DISPOSE])
      self[DISPOSE](hit.key, hit.value);

    self[LENGTH] -= hit.length;
    self[CACHE].delete(hit.key);
    self[LRU_LIST].removeNode(node);
  }
};

class Entry {
  constructor (key, value, length, now, maxAge) {
    this.key = key;
    this.value = value;
    this.length = length;
    this.now = now;
    this.maxAge = maxAge || 0;
  }
}

const forEachStep = (self, fn, node, thisp) => {
  let hit = node.value;
  if (isStale(self, hit)) {
    del(self, node);
    if (!self[ALLOW_STALE])
      hit = undefined;
  }
  if (hit)
    fn.call(thisp, hit.value, hit.key, self);
};

var lruCache = LRUCache;

// hoisted class for cyclic dependency
class Range {
  constructor (range, options) {
    options = parseOptions_1(options);

    if (range instanceof Range) {
      if (
        range.loose === !!options.loose &&
        range.includePrerelease === !!options.includePrerelease
      ) {
        return range
      } else {
        return new Range(range.raw, options)
      }
    }

    if (range instanceof comparator) {
      // just put it in the set and return
      this.raw = range.value;
      this.set = [[range]];
      this.format();
      return this
    }

    this.options = options;
    this.loose = !!options.loose;
    this.includePrerelease = !!options.includePrerelease;

    // First, split based on boolean or ||
    this.raw = range;
    this.set = range
      .split(/\s*\|\|\s*/)
      // map the range to a 2d array of comparators
      .map(range => this.parseRange(range.trim()))
      // throw out any comparator lists that are empty
      // this generally means that it was not a valid range, which is allowed
      // in loose mode, but will still throw if the WHOLE range is invalid.
      .filter(c => c.length);

    if (!this.set.length) {
      throw new TypeError(`Invalid SemVer Range: ${range}`)
    }

    // if we have any that are not the null set, throw out null sets.
    if (this.set.length > 1) {
      // keep the first one, in case they're all null sets
      const first = this.set[0];
      this.set = this.set.filter(c => !isNullSet(c[0]));
      if (this.set.length === 0)
        this.set = [first];
      else if (this.set.length > 1) {
        // if we have any that are *, then the range is just *
        for (const c of this.set) {
          if (c.length === 1 && isAny(c[0])) {
            this.set = [c];
            break
          }
        }
      }
    }

    this.format();
  }

  format () {
    this.range = this.set
      .map((comps) => {
        return comps.join(' ').trim()
      })
      .join('||')
      .trim();
    return this.range
  }

  toString () {
    return this.range
  }

  parseRange (range) {
    range = range.trim();

    // memoize range parsing for performance.
    // this is a very hot path, and fully deterministic.
    const memoOpts = Object.keys(this.options).join(',');
    const memoKey = `parseRange:${memoOpts}:${range}`;
    const cached = cache.get(memoKey);
    if (cached)
      return cached

    const loose = this.options.loose;
    // `1.2.3 - 1.2.4` => `>=1.2.3 <=1.2.4`
    const hr = loose ? re$3[t$3.HYPHENRANGELOOSE] : re$3[t$3.HYPHENRANGE];
    range = range.replace(hr, hyphenReplace(this.options.includePrerelease));
    debug_1('hyphen replace', range);
    // `> 1.2.3 < 1.2.5` => `>1.2.3 <1.2.5`
    range = range.replace(re$3[t$3.COMPARATORTRIM], comparatorTrimReplace);
    debug_1('comparator trim', range, re$3[t$3.COMPARATORTRIM]);

    // `~ 1.2.3` => `~1.2.3`
    range = range.replace(re$3[t$3.TILDETRIM], tildeTrimReplace);

    // `^ 1.2.3` => `^1.2.3`
    range = range.replace(re$3[t$3.CARETTRIM], caretTrimReplace);

    // normalize spaces
    range = range.split(/\s+/).join(' ');

    // At this point, the range is completely trimmed and
    // ready to be split into comparators.

    const compRe = loose ? re$3[t$3.COMPARATORLOOSE] : re$3[t$3.COMPARATOR];
    const rangeList = range
      .split(' ')
      .map(comp => parseComparator(comp, this.options))
      .join(' ')
      .split(/\s+/)
      // >=0.0.0 is equivalent to *
      .map(comp => replaceGTE0(comp, this.options))
      // in loose mode, throw out any that are not valid comparators
      .filter(this.options.loose ? comp => !!comp.match(compRe) : () => true)
      .map(comp => new comparator(comp, this.options));

    // if any comparators are the null set, then replace with JUST null set
    // if more than one comparator, remove any * comparators
    // also, don't include the same comparator more than once
    const l = rangeList.length;
    const rangeMap = new Map();
    for (const comp of rangeList) {
      if (isNullSet(comp))
        return [comp]
      rangeMap.set(comp.value, comp);
    }
    if (rangeMap.size > 1 && rangeMap.has(''))
      rangeMap.delete('');

    const result = [...rangeMap.values()];
    cache.set(memoKey, result);
    return result
  }

  intersects (range, options) {
    if (!(range instanceof Range)) {
      throw new TypeError('a Range is required')
    }

    return this.set.some((thisComparators) => {
      return (
        isSatisfiable(thisComparators, options) &&
        range.set.some((rangeComparators) => {
          return (
            isSatisfiable(rangeComparators, options) &&
            thisComparators.every((thisComparator) => {
              return rangeComparators.every((rangeComparator) => {
                return thisComparator.intersects(rangeComparator, options)
              })
            })
          )
        })
      )
    })
  }

  // if ANY of the sets match ALL of its comparators, then pass
  test (version) {
    if (!version) {
      return false
    }

    if (typeof version === 'string') {
      try {
        version = new semver(version, this.options);
      } catch (er) {
        return false
      }
    }

    for (let i = 0; i < this.set.length; i++) {
      if (testSet(this.set[i], version, this.options)) {
        return true
      }
    }
    return false
  }
}
var range = Range;


const cache = new lruCache({ max: 1000 });





const {
  re: re$3,
  t: t$3,
  comparatorTrimReplace,
  tildeTrimReplace,
  caretTrimReplace
} = re_1;

const isNullSet = c => c.value === '<0.0.0-0';
const isAny = c => c.value === '';

// take a set of comparators and determine whether there
// exists a version which can satisfy it
const isSatisfiable = (comparators, options) => {
  let result = true;
  const remainingComparators = comparators.slice();
  let testComparator = remainingComparators.pop();

  while (result && remainingComparators.length) {
    result = remainingComparators.every((otherComparator) => {
      return testComparator.intersects(otherComparator, options)
    });

    testComparator = remainingComparators.pop();
  }

  return result
};

// comprised of xranges, tildes, stars, and gtlt's at this point.
// already replaced the hyphen ranges
// turn into a set of JUST comparators.
const parseComparator = (comp, options) => {
  debug_1('comp', comp, options);
  comp = replaceCarets(comp, options);
  debug_1('caret', comp);
  comp = replaceTildes(comp, options);
  debug_1('tildes', comp);
  comp = replaceXRanges(comp, options);
  debug_1('xrange', comp);
  comp = replaceStars(comp, options);
  debug_1('stars', comp);
  return comp
};

const isX = id => !id || id.toLowerCase() === 'x' || id === '*';

// ~, ~> --> * (any, kinda silly)
// ~2, ~2.x, ~2.x.x, ~>2, ~>2.x ~>2.x.x --> >=2.0.0 <3.0.0-0
// ~2.0, ~2.0.x, ~>2.0, ~>2.0.x --> >=2.0.0 <2.1.0-0
// ~1.2, ~1.2.x, ~>1.2, ~>1.2.x --> >=1.2.0 <1.3.0-0
// ~1.2.3, ~>1.2.3 --> >=1.2.3 <1.3.0-0
// ~1.2.0, ~>1.2.0 --> >=1.2.0 <1.3.0-0
const replaceTildes = (comp, options) =>
  comp.trim().split(/\s+/).map((comp) => {
    return replaceTilde(comp, options)
  }).join(' ');

const replaceTilde = (comp, options) => {
  const r = options.loose ? re$3[t$3.TILDELOOSE] : re$3[t$3.TILDE];
  return comp.replace(r, (_, M, m, p, pr) => {
    debug_1('tilde', comp, _, M, m, p, pr);
    let ret;

    if (isX(M)) {
      ret = '';
    } else if (isX(m)) {
      ret = `>=${M}.0.0 <${+M + 1}.0.0-0`;
    } else if (isX(p)) {
      // ~1.2 == >=1.2.0 <1.3.0-0
      ret = `>=${M}.${m}.0 <${M}.${+m + 1}.0-0`;
    } else if (pr) {
      debug_1('replaceTilde pr', pr);
      ret = `>=${M}.${m}.${p}-${pr
      } <${M}.${+m + 1}.0-0`;
    } else {
      // ~1.2.3 == >=1.2.3 <1.3.0-0
      ret = `>=${M}.${m}.${p
      } <${M}.${+m + 1}.0-0`;
    }

    debug_1('tilde return', ret);
    return ret
  })
};

// ^ --> * (any, kinda silly)
// ^2, ^2.x, ^2.x.x --> >=2.0.0 <3.0.0-0
// ^2.0, ^2.0.x --> >=2.0.0 <3.0.0-0
// ^1.2, ^1.2.x --> >=1.2.0 <2.0.0-0
// ^1.2.3 --> >=1.2.3 <2.0.0-0
// ^1.2.0 --> >=1.2.0 <2.0.0-0
const replaceCarets = (comp, options) =>
  comp.trim().split(/\s+/).map((comp) => {
    return replaceCaret(comp, options)
  }).join(' ');

const replaceCaret = (comp, options) => {
  debug_1('caret', comp, options);
  const r = options.loose ? re$3[t$3.CARETLOOSE] : re$3[t$3.CARET];
  const z = options.includePrerelease ? '-0' : '';
  return comp.replace(r, (_, M, m, p, pr) => {
    debug_1('caret', comp, _, M, m, p, pr);
    let ret;

    if (isX(M)) {
      ret = '';
    } else if (isX(m)) {
      ret = `>=${M}.0.0${z} <${+M + 1}.0.0-0`;
    } else if (isX(p)) {
      if (M === '0') {
        ret = `>=${M}.${m}.0${z} <${M}.${+m + 1}.0-0`;
      } else {
        ret = `>=${M}.${m}.0${z} <${+M + 1}.0.0-0`;
      }
    } else if (pr) {
      debug_1('replaceCaret pr', pr);
      if (M === '0') {
        if (m === '0') {
          ret = `>=${M}.${m}.${p}-${pr
          } <${M}.${m}.${+p + 1}-0`;
        } else {
          ret = `>=${M}.${m}.${p}-${pr
          } <${M}.${+m + 1}.0-0`;
        }
      } else {
        ret = `>=${M}.${m}.${p}-${pr
        } <${+M + 1}.0.0-0`;
      }
    } else {
      debug_1('no pr');
      if (M === '0') {
        if (m === '0') {
          ret = `>=${M}.${m}.${p
          }${z} <${M}.${m}.${+p + 1}-0`;
        } else {
          ret = `>=${M}.${m}.${p
          }${z} <${M}.${+m + 1}.0-0`;
        }
      } else {
        ret = `>=${M}.${m}.${p
        } <${+M + 1}.0.0-0`;
      }
    }

    debug_1('caret return', ret);
    return ret
  })
};

const replaceXRanges = (comp, options) => {
  debug_1('replaceXRanges', comp, options);
  return comp.split(/\s+/).map((comp) => {
    return replaceXRange(comp, options)
  }).join(' ')
};

const replaceXRange = (comp, options) => {
  comp = comp.trim();
  const r = options.loose ? re$3[t$3.XRANGELOOSE] : re$3[t$3.XRANGE];
  return comp.replace(r, (ret, gtlt, M, m, p, pr) => {
    debug_1('xRange', comp, ret, gtlt, M, m, p, pr);
    const xM = isX(M);
    const xm = xM || isX(m);
    const xp = xm || isX(p);
    const anyX = xp;

    if (gtlt === '=' && anyX) {
      gtlt = '';
    }

    // if we're including prereleases in the match, then we need
    // to fix this to -0, the lowest possible prerelease value
    pr = options.includePrerelease ? '-0' : '';

    if (xM) {
      if (gtlt === '>' || gtlt === '<') {
        // nothing is allowed
        ret = '<0.0.0-0';
      } else {
        // nothing is forbidden
        ret = '*';
      }
    } else if (gtlt && anyX) {
      // we know patch is an x, because we have any x at all.
      // replace X with 0
      if (xm) {
        m = 0;
      }
      p = 0;

      if (gtlt === '>') {
        // >1 => >=2.0.0
        // >1.2 => >=1.3.0
        gtlt = '>=';
        if (xm) {
          M = +M + 1;
          m = 0;
          p = 0;
        } else {
          m = +m + 1;
          p = 0;
        }
      } else if (gtlt === '<=') {
        // <=0.7.x is actually <0.8.0, since any 0.7.x should
        // pass.  Similarly, <=7.x is actually <8.0.0, etc.
        gtlt = '<';
        if (xm) {
          M = +M + 1;
        } else {
          m = +m + 1;
        }
      }

      if (gtlt === '<')
        pr = '-0';

      ret = `${gtlt + M}.${m}.${p}${pr}`;
    } else if (xm) {
      ret = `>=${M}.0.0${pr} <${+M + 1}.0.0-0`;
    } else if (xp) {
      ret = `>=${M}.${m}.0${pr
      } <${M}.${+m + 1}.0-0`;
    }

    debug_1('xRange return', ret);

    return ret
  })
};

// Because * is AND-ed with everything else in the comparator,
// and '' means "any version", just remove the *s entirely.
const replaceStars = (comp, options) => {
  debug_1('replaceStars', comp, options);
  // Looseness is ignored here.  star is always as loose as it gets!
  return comp.trim().replace(re$3[t$3.STAR], '')
};

const replaceGTE0 = (comp, options) => {
  debug_1('replaceGTE0', comp, options);
  return comp.trim()
    .replace(re$3[options.includePrerelease ? t$3.GTE0PRE : t$3.GTE0], '')
};

// This function is passed to string.replace(re[t.HYPHENRANGE])
// M, m, patch, prerelease, build
// 1.2 - 3.4.5 => >=1.2.0 <=3.4.5
// 1.2.3 - 3.4 => >=1.2.0 <3.5.0-0 Any 3.4.x will do
// 1.2 - 3.4 => >=1.2.0 <3.5.0-0
const hyphenReplace = incPr => ($0,
  from, fM, fm, fp, fpr, fb,
  to, tM, tm, tp, tpr, tb) => {
  if (isX(fM)) {
    from = '';
  } else if (isX(fm)) {
    from = `>=${fM}.0.0${incPr ? '-0' : ''}`;
  } else if (isX(fp)) {
    from = `>=${fM}.${fm}.0${incPr ? '-0' : ''}`;
  } else if (fpr) {
    from = `>=${from}`;
  } else {
    from = `>=${from}${incPr ? '-0' : ''}`;
  }

  if (isX(tM)) {
    to = '';
  } else if (isX(tm)) {
    to = `<${+tM + 1}.0.0-0`;
  } else if (isX(tp)) {
    to = `<${tM}.${+tm + 1}.0-0`;
  } else if (tpr) {
    to = `<=${tM}.${tm}.${tp}-${tpr}`;
  } else if (incPr) {
    to = `<${tM}.${tm}.${+tp + 1}-0`;
  } else {
    to = `<=${to}`;
  }

  return (`${from} ${to}`).trim()
};

const testSet = (set, version, options) => {
  for (let i = 0; i < set.length; i++) {
    if (!set[i].test(version)) {
      return false
    }
  }

  if (version.prerelease.length && !options.includePrerelease) {
    // Find the set of versions that are allowed to have prereleases
    // For example, ^1.2.3-pr.1 desugars to >=1.2.3-pr.1 <2.0.0
    // That should allow `1.2.3-pr.2` to pass.
    // However, `1.2.4-alpha.notready` should NOT be allowed,
    // even though it's within the range set by the comparators.
    for (let i = 0; i < set.length; i++) {
      debug_1(set[i].semver);
      if (set[i].semver === comparator.ANY) {
        continue
      }

      if (set[i].semver.prerelease.length > 0) {
        const allowed = set[i].semver;
        if (allowed.major === version.major &&
            allowed.minor === version.minor &&
            allowed.patch === version.patch) {
          return true
        }
      }
    }

    // Version has a -pre, but it's not one of the ones we like.
    return false
  }

  return true
};

const ANY = Symbol('SemVer ANY');
// hoisted class for cyclic dependency
class Comparator {
  static get ANY () {
    return ANY
  }
  constructor (comp, options) {
    options = parseOptions_1(options);

    if (comp instanceof Comparator) {
      if (comp.loose === !!options.loose) {
        return comp
      } else {
        comp = comp.value;
      }
    }

    debug_1('comparator', comp, options);
    this.options = options;
    this.loose = !!options.loose;
    this.parse(comp);

    if (this.semver === ANY) {
      this.value = '';
    } else {
      this.value = this.operator + this.semver.version;
    }

    debug_1('comp', this);
  }

  parse (comp) {
    const r = this.options.loose ? re$4[t$4.COMPARATORLOOSE] : re$4[t$4.COMPARATOR];
    const m = comp.match(r);

    if (!m) {
      throw new TypeError(`Invalid comparator: ${comp}`)
    }

    this.operator = m[1] !== undefined ? m[1] : '';
    if (this.operator === '=') {
      this.operator = '';
    }

    // if it literally is just '>' or '' then allow anything.
    if (!m[2]) {
      this.semver = ANY;
    } else {
      this.semver = new semver(m[2], this.options.loose);
    }
  }

  toString () {
    return this.value
  }

  test (version) {
    debug_1('Comparator.test', version, this.options.loose);

    if (this.semver === ANY || version === ANY) {
      return true
    }

    if (typeof version === 'string') {
      try {
        version = new semver(version, this.options);
      } catch (er) {
        return false
      }
    }

    return cmp_1(version, this.operator, this.semver, this.options)
  }

  intersects (comp, options) {
    if (!(comp instanceof Comparator)) {
      throw new TypeError('a Comparator is required')
    }

    if (!options || typeof options !== 'object') {
      options = {
        loose: !!options,
        includePrerelease: false
      };
    }

    if (this.operator === '') {
      if (this.value === '') {
        return true
      }
      return new range(comp.value, options).test(this.value)
    } else if (comp.operator === '') {
      if (comp.value === '') {
        return true
      }
      return new range(this.value, options).test(comp.semver)
    }

    const sameDirectionIncreasing =
      (this.operator === '>=' || this.operator === '>') &&
      (comp.operator === '>=' || comp.operator === '>');
    const sameDirectionDecreasing =
      (this.operator === '<=' || this.operator === '<') &&
      (comp.operator === '<=' || comp.operator === '<');
    const sameSemVer = this.semver.version === comp.semver.version;
    const differentDirectionsInclusive =
      (this.operator === '>=' || this.operator === '<=') &&
      (comp.operator === '>=' || comp.operator === '<=');
    const oppositeDirectionsLessThan =
      cmp_1(this.semver, '<', comp.semver, options) &&
      (this.operator === '>=' || this.operator === '>') &&
        (comp.operator === '<=' || comp.operator === '<');
    const oppositeDirectionsGreaterThan =
      cmp_1(this.semver, '>', comp.semver, options) &&
      (this.operator === '<=' || this.operator === '<') &&
        (comp.operator === '>=' || comp.operator === '>');

    return (
      sameDirectionIncreasing ||
      sameDirectionDecreasing ||
      (sameSemVer && differentDirectionsInclusive) ||
      oppositeDirectionsLessThan ||
      oppositeDirectionsGreaterThan
    )
  }
}

var comparator = Comparator;


const {re: re$4, t: t$4} = re_1;

const satisfies = (version, range$1, options) => {
  try {
    range$1 = new range(range$1, options);
  } catch (er) {
    return false
  }
  return range$1.test(version)
};
var satisfies_1 = satisfies;

// Mostly just for testing and legacy API reasons
const toComparators = (range$1, options) =>
  new range(range$1, options).set
    .map(comp => comp.map(c => c.value).join(' ').trim().split(' '));

var toComparators_1 = toComparators;

const maxSatisfying = (versions, range$1, options) => {
  let max = null;
  let maxSV = null;
  let rangeObj = null;
  try {
    rangeObj = new range(range$1, options);
  } catch (er) {
    return null
  }
  versions.forEach((v) => {
    if (rangeObj.test(v)) {
      // satisfies(v, range, options)
      if (!max || maxSV.compare(v) === -1) {
        // compare(max, v, true)
        max = v;
        maxSV = new semver(max, options);
      }
    }
  });
  return max
};
var maxSatisfying_1 = maxSatisfying;

const minSatisfying = (versions, range$1, options) => {
  let min = null;
  let minSV = null;
  let rangeObj = null;
  try {
    rangeObj = new range(range$1, options);
  } catch (er) {
    return null
  }
  versions.forEach((v) => {
    if (rangeObj.test(v)) {
      // satisfies(v, range, options)
      if (!min || minSV.compare(v) === 1) {
        // compare(min, v, true)
        min = v;
        minSV = new semver(min, options);
      }
    }
  });
  return min
};
var minSatisfying_1 = minSatisfying;

const minVersion = (range$1, loose) => {
  range$1 = new range(range$1, loose);

  let minver = new semver('0.0.0');
  if (range$1.test(minver)) {
    return minver
  }

  minver = new semver('0.0.0-0');
  if (range$1.test(minver)) {
    return minver
  }

  minver = null;
  for (let i = 0; i < range$1.set.length; ++i) {
    const comparators = range$1.set[i];

    let setMin = null;
    comparators.forEach((comparator) => {
      // Clone to avoid manipulating the comparator's semver object.
      const compver = new semver(comparator.semver.version);
      switch (comparator.operator) {
        case '>':
          if (compver.prerelease.length === 0) {
            compver.patch++;
          } else {
            compver.prerelease.push(0);
          }
          compver.raw = compver.format();
          /* fallthrough */
        case '':
        case '>=':
          if (!setMin || gt_1(compver, setMin)) {
            setMin = compver;
          }
          break
        case '<':
        case '<=':
          /* Ignore maximum versions */
          break
        /* istanbul ignore next */
        default:
          throw new Error(`Unexpected operation: ${comparator.operator}`)
      }
    });
    if (setMin && (!minver || gt_1(minver, setMin)))
      minver = setMin;
  }

  if (minver && range$1.test(minver)) {
    return minver
  }

  return null
};
var minVersion_1 = minVersion;

const validRange = (range$1, options) => {
  try {
    // Return '*' instead of '' so that truthiness works.
    // This will throw if it's invalid anyway
    return new range(range$1, options).range || '*'
  } catch (er) {
    return null
  }
};
var valid$1 = validRange;

const {ANY: ANY$1} = comparator;







const outside = (version, range$1, hilo, options) => {
  version = new semver(version, options);
  range$1 = new range(range$1, options);

  let gtfn, ltefn, ltfn, comp, ecomp;
  switch (hilo) {
    case '>':
      gtfn = gt_1;
      ltefn = lte_1;
      ltfn = lt_1;
      comp = '>';
      ecomp = '>=';
      break
    case '<':
      gtfn = lt_1;
      ltefn = gte_1;
      ltfn = gt_1;
      comp = '<';
      ecomp = '<=';
      break
    default:
      throw new TypeError('Must provide a hilo val of "<" or ">"')
  }

  // If it satisfies the range it is not outside
  if (satisfies_1(version, range$1, options)) {
    return false
  }

  // From now on, variable terms are as if we're in "gtr" mode.
  // but note that everything is flipped for the "ltr" function.

  for (let i = 0; i < range$1.set.length; ++i) {
    const comparators = range$1.set[i];

    let high = null;
    let low = null;

    comparators.forEach((comparator$1) => {
      if (comparator$1.semver === ANY$1) {
        comparator$1 = new comparator('>=0.0.0');
      }
      high = high || comparator$1;
      low = low || comparator$1;
      if (gtfn(comparator$1.semver, high.semver, options)) {
        high = comparator$1;
      } else if (ltfn(comparator$1.semver, low.semver, options)) {
        low = comparator$1;
      }
    });

    // If the edge version comparator has a operator then our version
    // isn't outside it
    if (high.operator === comp || high.operator === ecomp) {
      return false
    }

    // If the lowest version comparator has an operator and our version
    // is less than it then it isn't higher than the range
    if ((!low.operator || low.operator === comp) &&
        ltefn(version, low.semver)) {
      return false
    } else if (low.operator === ecomp && ltfn(version, low.semver)) {
      return false
    }
  }
  return true
};

var outside_1 = outside;

// Determine if version is greater than all the versions possible in the range.

const gtr = (version, range, options) => outside_1(version, range, '>', options);
var gtr_1 = gtr;

// Determine if version is less than all the versions possible in the range
const ltr = (version, range, options) => outside_1(version, range, '<', options);
var ltr_1 = ltr;

const intersects = (r1, r2, options) => {
  r1 = new range(r1, options);
  r2 = new range(r2, options);
  return r1.intersects(r2)
};
var intersects_1 = intersects;

// given a set of versions and a range, create a "simplified" range
// that includes the same versions that the original range does
// If the original range is shorter than the simplified one, return that.


var simplify = (versions, range, options) => {
  const set = [];
  let min = null;
  let prev = null;
  const v = versions.sort((a, b) => compare_1(a, b, options));
  for (const version of v) {
    const included = satisfies_1(version, range, options);
    if (included) {
      prev = version;
      if (!min)
        min = version;
    } else {
      if (prev) {
        set.push([min, prev]);
      }
      prev = null;
      min = null;
    }
  }
  if (min)
    set.push([min, null]);

  const ranges = [];
  for (const [min, max] of set) {
    if (min === max)
      ranges.push(min);
    else if (!max && min === v[0])
      ranges.push('*');
    else if (!max)
      ranges.push(`>=${min}`);
    else if (min === v[0])
      ranges.push(`<=${max}`);
    else
      ranges.push(`${min} - ${max}`);
  }
  const simplified = ranges.join(' || ');
  const original = typeof range.raw === 'string' ? range.raw : String(range);
  return simplified.length < original.length ? simplified : range
};

const { ANY: ANY$2 } = comparator;



// Complex range `r1 || r2 || ...` is a subset of `R1 || R2 || ...` iff:
// - Every simple range `r1, r2, ...` is a subset of some `R1, R2, ...`
//
// Simple range `c1 c2 ...` is a subset of simple range `C1 C2 ...` iff:
// - If c is only the ANY comparator
//   - If C is only the ANY comparator, return true
//   - Else return false
// - Let EQ be the set of = comparators in c
// - If EQ is more than one, return true (null set)
// - Let GT be the highest > or >= comparator in c
// - Let LT be the lowest < or <= comparator in c
// - If GT and LT, and GT.semver > LT.semver, return true (null set)
// - If EQ
//   - If GT, and EQ does not satisfy GT, return true (null set)
//   - If LT, and EQ does not satisfy LT, return true (null set)
//   - If EQ satisfies every C, return true
//   - Else return false
// - If GT
//   - If GT.semver is lower than any > or >= comp in C, return false
//   - If GT is >=, and GT.semver does not satisfy every C, return false
// - If LT
//   - If LT.semver is greater than any < or <= comp in C, return false
//   - If LT is <=, and LT.semver does not satisfy every C, return false
// - If any C is a = range, and GT or LT are set, return false
// - Else return true

const subset = (sub, dom, options) => {
  if (sub === dom)
    return true

  sub = new range(sub, options);
  dom = new range(dom, options);
  let sawNonNull = false;

  OUTER: for (const simpleSub of sub.set) {
    for (const simpleDom of dom.set) {
      const isSub = simpleSubset(simpleSub, simpleDom, options);
      sawNonNull = sawNonNull || isSub !== null;
      if (isSub)
        continue OUTER
    }
    // the null set is a subset of everything, but null simple ranges in
    // a complex range should be ignored.  so if we saw a non-null range,
    // then we know this isn't a subset, but if EVERY simple range was null,
    // then it is a subset.
    if (sawNonNull)
      return false
  }
  return true
};

const simpleSubset = (sub, dom, options) => {
  if (sub === dom)
    return true

  if (sub.length === 1 && sub[0].semver === ANY$2)
    return dom.length === 1 && dom[0].semver === ANY$2

  const eqSet = new Set();
  let gt, lt;
  for (const c of sub) {
    if (c.operator === '>' || c.operator === '>=')
      gt = higherGT(gt, c, options);
    else if (c.operator === '<' || c.operator === '<=')
      lt = lowerLT(lt, c, options);
    else
      eqSet.add(c.semver);
  }

  if (eqSet.size > 1)
    return null

  let gtltComp;
  if (gt && lt) {
    gtltComp = compare_1(gt.semver, lt.semver, options);
    if (gtltComp > 0)
      return null
    else if (gtltComp === 0 && (gt.operator !== '>=' || lt.operator !== '<='))
      return null
  }

  // will iterate one or zero times
  for (const eq of eqSet) {
    if (gt && !satisfies_1(eq, String(gt), options))
      return null

    if (lt && !satisfies_1(eq, String(lt), options))
      return null

    for (const c of dom) {
      if (!satisfies_1(eq, String(c), options))
        return false
    }

    return true
  }

  let higher, lower;
  let hasDomLT, hasDomGT;
  for (const c of dom) {
    hasDomGT = hasDomGT || c.operator === '>' || c.operator === '>=';
    hasDomLT = hasDomLT || c.operator === '<' || c.operator === '<=';
    if (gt) {
      if (c.operator === '>' || c.operator === '>=') {
        higher = higherGT(gt, c, options);
        if (higher === c && higher !== gt)
          return false
      } else if (gt.operator === '>=' && !satisfies_1(gt.semver, String(c), options))
        return false
    }
    if (lt) {
      if (c.operator === '<' || c.operator === '<=') {
        lower = lowerLT(lt, c, options);
        if (lower === c && lower !== lt)
          return false
      } else if (lt.operator === '<=' && !satisfies_1(lt.semver, String(c), options))
        return false
    }
    if (!c.operator && (lt || gt) && gtltComp !== 0)
      return false
  }

  // if there was a < or >, and nothing in the dom, then must be false
  // UNLESS it was limited by another range in the other direction.
  // Eg, >1.0.0 <1.0.1 is still a subset of <2.0.0
  if (gt && hasDomLT && !lt && gtltComp !== 0)
    return false

  if (lt && hasDomGT && !gt && gtltComp !== 0)
    return false

  return true
};

// >=1.2.3 is lower than >1.2.3
const higherGT = (a, b, options) => {
  if (!a)
    return b
  const comp = compare_1(a.semver, b.semver, options);
  return comp > 0 ? a
    : comp < 0 ? b
    : b.operator === '>' && a.operator === '>=' ? b
    : a
};

// <=1.2.3 is higher than <1.2.3
const lowerLT = (a, b, options) => {
  if (!a)
    return b
  const comp = compare_1(a.semver, b.semver, options);
  return comp < 0 ? a
    : comp > 0 ? b
    : b.operator === '<' && a.operator === '<=' ? b
    : a
};

var subset_1 = subset;

// just pre-load all the stuff that index.js lazily exports

var semver$1 = {
  re: re_1.re,
  src: re_1.src,
  tokens: re_1.t,
  SEMVER_SPEC_VERSION: constants.SEMVER_SPEC_VERSION,
  SemVer: semver,
  compareIdentifiers: identifiers.compareIdentifiers,
  rcompareIdentifiers: identifiers.rcompareIdentifiers,
  parse: parse_1,
  valid: valid_1,
  clean: clean_1,
  inc: inc_1,
  diff: diff_1,
  major: major_1,
  minor: minor_1,
  patch: patch_1,
  prerelease: prerelease_1,
  compare: compare_1,
  rcompare: rcompare_1,
  compareLoose: compareLoose_1,
  compareBuild: compareBuild_1,
  sort: sort_1,
  rsort: rsort_1,
  gt: gt_1,
  lt: lt_1,
  eq: eq_1,
  neq: neq_1,
  gte: gte_1,
  lte: lte_1,
  cmp: cmp_1,
  coerce: coerce_1,
  Comparator: comparator,
  Range: range,
  satisfies: satisfies_1,
  toComparators: toComparators_1,
  maxSatisfying: maxSatisfying_1,
  minSatisfying: minSatisfying_1,
  minVersion: minVersion_1,
  validRange: valid$1,
  outside: outside_1,
  gtr: gtr_1,
  ltr: ltr_1,
  intersects: intersects_1,
  simplifyRange: simplify,
  subset: subset_1,
};

var is = createCommonjsModule(function (module, exports) {
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
Object.defineProperty(exports, "__esModule", { value: true });
exports.asPromise = exports.thenable = exports.typedArray = exports.stringArray = exports.array = exports.func = exports.error = exports.number = exports.string = exports.boolean = void 0;
function boolean(value) {
    return value === true || value === false;
}
exports.boolean = boolean;
function string(value) {
    return typeof value === 'string' || value instanceof String;
}
exports.string = string;
function number(value) {
    return typeof value === 'number' || value instanceof Number;
}
exports.number = number;
function error(value) {
    return value instanceof Error;
}
exports.error = error;
function func(value) {
    return typeof value === 'function';
}
exports.func = func;
function array(value) {
    return Array.isArray(value);
}
exports.array = array;
function stringArray(value) {
    return array(value) && value.every(elem => string(elem));
}
exports.stringArray = stringArray;
function typedArray(value, check) {
    return Array.isArray(value) && value.every(check);
}
exports.typedArray = typedArray;
function thenable(value) {
    return value && func(value.then);
}
exports.thenable = thenable;
function asPromise(value) {
    if (value instanceof Promise) {
        return value;
    }
    else if (thenable(value)) {
        return new Promise((resolve, reject) => {
            value.then((resolved) => resolve(resolved), (error) => reject(error));
        });
    }
    else {
        return Promise.resolve(value);
    }
}
exports.asPromise = asPromise;

});

/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

let _ral;
function RAL() {
    if (_ral === undefined) {
        throw new Error(`No runtime abstraction layer installed`);
    }
    return _ral;
}
(function (RAL) {
    function install(ral) {
        if (ral === undefined) {
            throw new Error(`No runtime abstraction layer provided`);
        }
        _ral = ral;
    }
    RAL.install = install;
})(RAL || (RAL = {}));
var _default = RAL;


var ral = /*#__PURE__*/Object.defineProperty({
	default: _default
}, '__esModule', {value: true});

var disposable = createCommonjsModule(function (module, exports) {
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.Disposable = void 0;
var Disposable;
(function (Disposable) {
    function create(func) {
        return {
            dispose: func
        };
    }
    Disposable.create = create;
})(Disposable = exports.Disposable || (exports.Disposable = {}));

});

var messageBuffer = createCommonjsModule(function (module, exports) {
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractMessageBuffer = void 0;
const CR = 13;
const LF = 10;
const CRLF = '\r\n';
class AbstractMessageBuffer {
    constructor(encoding = 'utf-8') {
        this._encoding = encoding;
        this._chunks = [];
        this._totalLength = 0;
    }
    get encoding() {
        return this._encoding;
    }
    append(chunk) {
        const toAppend = typeof chunk === 'string' ? this.fromString(chunk, this._encoding) : chunk;
        this._chunks.push(toAppend);
        this._totalLength += toAppend.byteLength;
    }
    tryReadHeaders() {
        if (this._chunks.length === 0) {
            return undefined;
        }
        let state = 0;
        let chunkIndex = 0;
        let offset = 0;
        let chunkBytesRead = 0;
        row: while (chunkIndex < this._chunks.length) {
            const chunk = this._chunks[chunkIndex];
            offset = 0;
             while (offset < chunk.length) {
                const value = chunk[offset];
                switch (value) {
                    case CR:
                        switch (state) {
                            case 0:
                                state = 1;
                                break;
                            case 2:
                                state = 3;
                                break;
                            default:
                                state = 0;
                        }
                        break;
                    case LF:
                        switch (state) {
                            case 1:
                                state = 2;
                                break;
                            case 3:
                                state = 4;
                                offset++;
                                break row;
                            default:
                                state = 0;
                        }
                        break;
                    default:
                        state = 0;
                }
                offset++;
            }
            chunkBytesRead += chunk.byteLength;
            chunkIndex++;
        }
        if (state !== 4) {
            return undefined;
        }
        // The buffer contains the two CRLF at the end. So we will
        // have two empty lines after the split at the end as well.
        const buffer = this._read(chunkBytesRead + offset);
        const result = new Map();
        const headers = this.toString(buffer, 'ascii').split(CRLF);
        if (headers.length < 2) {
            return result;
        }
        for (let i = 0; i < headers.length - 2; i++) {
            const header = headers[i];
            const index = header.indexOf(':');
            if (index === -1) {
                throw new Error('Message header must separate key and value using :');
            }
            const key = header.substr(0, index);
            const value = header.substr(index + 1).trim();
            result.set(key, value);
        }
        return result;
    }
    tryReadBody(length) {
        if (this._totalLength < length) {
            return undefined;
        }
        return this._read(length);
    }
    get numberOfBytes() {
        return this._totalLength;
    }
    _read(byteCount) {
        if (byteCount === 0) {
            return this.emptyBuffer();
        }
        if (byteCount > this._totalLength) {
            throw new Error(`Cannot read so many bytes!`);
        }
        if (this._chunks[0].byteLength === byteCount) {
            // super fast path, precisely first chunk must be returned
            const chunk = this._chunks[0];
            this._chunks.shift();
            this._totalLength -= byteCount;
            return this.asNative(chunk);
        }
        if (this._chunks[0].byteLength > byteCount) {
            // fast path, the reading is entirely within the first chunk
            const chunk = this._chunks[0];
            const result = this.asNative(chunk, byteCount);
            this._chunks[0] = chunk.slice(byteCount);
            this._totalLength -= byteCount;
            return result;
        }
        const result = this.allocNative(byteCount);
        let resultOffset = 0;
        let chunkIndex = 0;
        while (byteCount > 0) {
            const chunk = this._chunks[chunkIndex];
            if (chunk.byteLength > byteCount) {
                // this chunk will survive
                const chunkPart = chunk.slice(0, byteCount);
                result.set(chunkPart, resultOffset);
                resultOffset += byteCount;
                this._chunks[chunkIndex] = chunk.slice(byteCount);
                this._totalLength -= byteCount;
                byteCount -= byteCount;
            }
            else {
                // this chunk will be entirely read
                result.set(chunk, resultOffset);
                resultOffset += chunk.byteLength;
                this._chunks.shift();
                this._totalLength -= chunk.byteLength;
                byteCount -= chunk.byteLength;
            }
        }
        return result;
    }
}
exports.AbstractMessageBuffer = AbstractMessageBuffer;

});

/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */





class MessageBuffer extends messageBuffer.AbstractMessageBuffer {
    constructor(encoding = 'utf-8') {
        super(encoding);
    }
    emptyBuffer() {
        return MessageBuffer.emptyBuffer;
    }
    fromString(value, encoding) {
        return Buffer.from(value, encoding);
    }
    toString(value, encoding) {
        if (value instanceof Buffer) {
            return value.toString(encoding);
        }
        else {
            return new util_1__default['default'].TextDecoder(encoding).decode(value);
        }
    }
    asNative(buffer, length) {
        if (length === undefined) {
            return buffer instanceof Buffer ? buffer : Buffer.from(buffer);
        }
        else {
            return buffer instanceof Buffer ? buffer.slice(0, length) : Buffer.from(buffer, 0, length);
        }
    }
    allocNative(length) {
        return Buffer.allocUnsafe(length);
    }
}
MessageBuffer.emptyBuffer = Buffer.allocUnsafe(0);
class ReadableStreamWrapper {
    constructor(stream) {
        this.stream = stream;
    }
    onClose(listener) {
        this.stream.on('close', listener);
        return disposable.Disposable.create(() => this.stream.off('close', listener));
    }
    onError(listener) {
        this.stream.on('error', listener);
        return disposable.Disposable.create(() => this.stream.off('error', listener));
    }
    onEnd(listener) {
        this.stream.on('end', listener);
        return disposable.Disposable.create(() => this.stream.off('end', listener));
    }
    onData(listener) {
        this.stream.on('data', listener);
        return disposable.Disposable.create(() => this.stream.off('data', listener));
    }
}
class WritableStreamWrapper {
    constructor(stream) {
        this.stream = stream;
    }
    onClose(listener) {
        this.stream.on('close', listener);
        return disposable.Disposable.create(() => this.stream.off('close', listener));
    }
    onError(listener) {
        this.stream.on('error', listener);
        return disposable.Disposable.create(() => this.stream.off('error', listener));
    }
    onEnd(listener) {
        this.stream.on('end', listener);
        return disposable.Disposable.create(() => this.stream.off('end', listener));
    }
    write(data, encoding) {
        return new Promise((resolve, reject) => {
            const callback = (error) => {
                if (error === undefined || error === null) {
                    resolve();
                }
                else {
                    reject(error);
                }
            };
            if (typeof data === 'string') {
                this.stream.write(data, encoding, callback);
            }
            else {
                this.stream.write(data, callback);
            }
        });
    }
    end() {
        this.stream.end();
    }
}
const _ril = Object.freeze({
    messageBuffer: Object.freeze({
        create: (encoding) => new MessageBuffer(encoding)
    }),
    applicationJson: Object.freeze({
        encoder: Object.freeze({
            name: 'application/json',
            encode: (msg, options) => {
                try {
                    return Promise.resolve(Buffer.from(JSON.stringify(msg, undefined, 0), options.charset));
                }
                catch (err) {
                    return Promise.reject(err);
                }
            }
        }),
        decoder: Object.freeze({
            name: 'application/json',
            decode: (buffer, options) => {
                try {
                    if (buffer instanceof Buffer) {
                        return Promise.resolve(JSON.parse(buffer.toString(options.charset)));
                    }
                    else {
                        return Promise.resolve(JSON.parse(new util_1__default['default'].TextDecoder(options.charset).decode(buffer)));
                    }
                }
                catch (err) {
                    return Promise.reject(err);
                }
            }
        })
    }),
    stream: Object.freeze({
        asReadableStream: (stream) => new ReadableStreamWrapper(stream),
        asWritableStream: (stream) => new WritableStreamWrapper(stream)
    }),
    console: console,
    timer: Object.freeze({
        setTimeout(callback, ms, ...args) {
            return setTimeout(callback, ms, ...args);
        },
        clearTimeout(handle) {
            clearTimeout(handle);
        },
        setImmediate(callback, ...args) {
            return setImmediate(callback, ...args);
        },
        clearImmediate(handle) {
            clearImmediate(handle);
        }
    })
});
function RIL() {
    return _ril;
}
(function (RIL) {
    function install() {
        ral.default.install(_ril);
    }
    RIL.install = install;
})(RIL || (RIL = {}));
var _default$1 = RIL;


var ril = /*#__PURE__*/Object.defineProperty({
	default: _default$1
}, '__esModule', {value: true});

var is$1 = createCommonjsModule(function (module, exports) {
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringArray = exports.array = exports.func = exports.error = exports.number = exports.string = exports.boolean = void 0;
function boolean(value) {
    return value === true || value === false;
}
exports.boolean = boolean;
function string(value) {
    return typeof value === 'string' || value instanceof String;
}
exports.string = string;
function number(value) {
    return typeof value === 'number' || value instanceof Number;
}
exports.number = number;
function error(value) {
    return value instanceof Error;
}
exports.error = error;
function func(value) {
    return typeof value === 'function';
}
exports.func = func;
function array(value) {
    return Array.isArray(value);
}
exports.array = array;
function stringArray(value) {
    return array(value) && value.every(elem => string(elem));
}
exports.stringArray = stringArray;

});

var messages = createCommonjsModule(function (module, exports) {
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
Object.defineProperty(exports, "__esModule", { value: true });
exports.isResponseMessage = exports.isNotificationMessage = exports.isRequestMessage = exports.NotificationType9 = exports.NotificationType8 = exports.NotificationType7 = exports.NotificationType6 = exports.NotificationType5 = exports.NotificationType4 = exports.NotificationType3 = exports.NotificationType2 = exports.NotificationType1 = exports.NotificationType0 = exports.NotificationType = exports.RequestType9 = exports.RequestType8 = exports.RequestType7 = exports.RequestType6 = exports.RequestType5 = exports.RequestType4 = exports.RequestType3 = exports.RequestType2 = exports.RequestType1 = exports.RequestType = exports.RequestType0 = exports.AbstractMessageSignature = exports.ParameterStructures = exports.ResponseError = exports.ErrorCodes = void 0;

/**
 * Predefined error codes.
 */
var ErrorCodes;
(function (ErrorCodes) {
    // Defined by JSON RPC
    ErrorCodes.ParseError = -32700;
    ErrorCodes.InvalidRequest = -32600;
    ErrorCodes.MethodNotFound = -32601;
    ErrorCodes.InvalidParams = -32602;
    ErrorCodes.InternalError = -32603;
    /**
     * This is the start range of JSON RPC reserved error codes.
     * It doesn't denote a real error code. No application error codes should
     * be defined between the start and end range. For backwards
     * compatibility the `ServerNotInitialized` and the `UnknownErrorCode`
     * are left in the range.
     *
     * @since 3.16.0
    */
    ErrorCodes.jsonrpcReservedErrorRangeStart = -32099;
    /** @deprecated use  jsonrpcReservedErrorRangeStart */
    ErrorCodes.serverErrorStart = ErrorCodes.jsonrpcReservedErrorRangeStart;
    ErrorCodes.MessageWriteError = -32099;
    ErrorCodes.MessageReadError = -32098;
    ErrorCodes.ServerNotInitialized = -32002;
    ErrorCodes.UnknownErrorCode = -32001;
    /**
     * This is the end range of JSON RPC reserved error codes.
     * It doesn't denote a real error code.
     *
     * @since 3.16.0
    */
    ErrorCodes.jsonrpcReservedErrorRangeEnd = -32000;
    /** @deprecated use  jsonrpcReservedErrorRangeEnd */
    ErrorCodes.serverErrorEnd = ErrorCodes.jsonrpcReservedErrorRangeEnd;
})(ErrorCodes = exports.ErrorCodes || (exports.ErrorCodes = {}));
/**
 * An error object return in a response in case a request
 * has failed.
 */
class ResponseError extends Error {
    constructor(code, message, data) {
        super(message);
        this.code = is$1.number(code) ? code : ErrorCodes.UnknownErrorCode;
        this.data = data;
        Object.setPrototypeOf(this, ResponseError.prototype);
    }
    toJson() {
        return {
            code: this.code,
            message: this.message,
            data: this.data,
        };
    }
}
exports.ResponseError = ResponseError;
class ParameterStructures {
    constructor(kind) {
        this.kind = kind;
    }
    static is(value) {
        return value === ParameterStructures.auto || value === ParameterStructures.byName || value === ParameterStructures.byPosition;
    }
    toString() {
        return this.kind;
    }
}
exports.ParameterStructures = ParameterStructures;
/**
 * The parameter structure is automatically inferred on the number of parameters
 * and the parameter type in case of a single param.
 */
ParameterStructures.auto = new ParameterStructures('auto');
/**
 * Forces `byPosition` parameter structure. This is useful if you have a single
 * parameter which has a literal type.
 */
ParameterStructures.byPosition = new ParameterStructures('byPosition');
/**
 * Forces `byName` parameter structure. This is only useful when having a single
 * parameter. The library will report errors if used with a different number of
 * parameters.
 */
ParameterStructures.byName = new ParameterStructures('byName');
/**
 * An abstract implementation of a MessageType.
 */
class AbstractMessageSignature {
    constructor(method, numberOfParams) {
        this.method = method;
        this.numberOfParams = numberOfParams;
    }
    get parameterStructures() {
        return ParameterStructures.auto;
    }
}
exports.AbstractMessageSignature = AbstractMessageSignature;
/**
 * Classes to type request response pairs
 */
class RequestType0 extends AbstractMessageSignature {
    constructor(method) {
        super(method, 0);
    }
}
exports.RequestType0 = RequestType0;
class RequestType extends AbstractMessageSignature {
    constructor(method, _parameterStructures = ParameterStructures.auto) {
        super(method, 1);
        this._parameterStructures = _parameterStructures;
    }
    get parameterStructures() {
        return this._parameterStructures;
    }
}
exports.RequestType = RequestType;
class RequestType1 extends AbstractMessageSignature {
    constructor(method, _parameterStructures = ParameterStructures.auto) {
        super(method, 1);
        this._parameterStructures = _parameterStructures;
    }
    get parameterStructures() {
        return this._parameterStructures;
    }
}
exports.RequestType1 = RequestType1;
class RequestType2 extends AbstractMessageSignature {
    constructor(method) {
        super(method, 2);
    }
}
exports.RequestType2 = RequestType2;
class RequestType3 extends AbstractMessageSignature {
    constructor(method) {
        super(method, 3);
    }
}
exports.RequestType3 = RequestType3;
class RequestType4 extends AbstractMessageSignature {
    constructor(method) {
        super(method, 4);
    }
}
exports.RequestType4 = RequestType4;
class RequestType5 extends AbstractMessageSignature {
    constructor(method) {
        super(method, 5);
    }
}
exports.RequestType5 = RequestType5;
class RequestType6 extends AbstractMessageSignature {
    constructor(method) {
        super(method, 6);
    }
}
exports.RequestType6 = RequestType6;
class RequestType7 extends AbstractMessageSignature {
    constructor(method) {
        super(method, 7);
    }
}
exports.RequestType7 = RequestType7;
class RequestType8 extends AbstractMessageSignature {
    constructor(method) {
        super(method, 8);
    }
}
exports.RequestType8 = RequestType8;
class RequestType9 extends AbstractMessageSignature {
    constructor(method) {
        super(method, 9);
    }
}
exports.RequestType9 = RequestType9;
class NotificationType extends AbstractMessageSignature {
    constructor(method, _parameterStructures = ParameterStructures.auto) {
        super(method, 1);
        this._parameterStructures = _parameterStructures;
    }
    get parameterStructures() {
        return this._parameterStructures;
    }
}
exports.NotificationType = NotificationType;
class NotificationType0 extends AbstractMessageSignature {
    constructor(method) {
        super(method, 0);
    }
}
exports.NotificationType0 = NotificationType0;
class NotificationType1 extends AbstractMessageSignature {
    constructor(method, _parameterStructures = ParameterStructures.auto) {
        super(method, 1);
        this._parameterStructures = _parameterStructures;
    }
    get parameterStructures() {
        return this._parameterStructures;
    }
}
exports.NotificationType1 = NotificationType1;
class NotificationType2 extends AbstractMessageSignature {
    constructor(method) {
        super(method, 2);
    }
}
exports.NotificationType2 = NotificationType2;
class NotificationType3 extends AbstractMessageSignature {
    constructor(method) {
        super(method, 3);
    }
}
exports.NotificationType3 = NotificationType3;
class NotificationType4 extends AbstractMessageSignature {
    constructor(method) {
        super(method, 4);
    }
}
exports.NotificationType4 = NotificationType4;
class NotificationType5 extends AbstractMessageSignature {
    constructor(method) {
        super(method, 5);
    }
}
exports.NotificationType5 = NotificationType5;
class NotificationType6 extends AbstractMessageSignature {
    constructor(method) {
        super(method, 6);
    }
}
exports.NotificationType6 = NotificationType6;
class NotificationType7 extends AbstractMessageSignature {
    constructor(method) {
        super(method, 7);
    }
}
exports.NotificationType7 = NotificationType7;
class NotificationType8 extends AbstractMessageSignature {
    constructor(method) {
        super(method, 8);
    }
}
exports.NotificationType8 = NotificationType8;
class NotificationType9 extends AbstractMessageSignature {
    constructor(method) {
        super(method, 9);
    }
}
exports.NotificationType9 = NotificationType9;
/**
 * Tests if the given message is a request message
 */
function isRequestMessage(message) {
    const candidate = message;
    return candidate && is$1.string(candidate.method) && (is$1.string(candidate.id) || is$1.number(candidate.id));
}
exports.isRequestMessage = isRequestMessage;
/**
 * Tests if the given message is a notification message
 */
function isNotificationMessage(message) {
    const candidate = message;
    return candidate && is$1.string(candidate.method) && message.id === void 0;
}
exports.isNotificationMessage = isNotificationMessage;
/**
 * Tests if the given message is a response message
 */
function isResponseMessage(message) {
    const candidate = message;
    return candidate && (candidate.result !== void 0 || !!candidate.error) && (is$1.string(candidate.id) || is$1.number(candidate.id) || candidate.id === null);
}
exports.isResponseMessage = isResponseMessage;

});

var events = createCommonjsModule(function (module, exports) {
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Emitter = exports.Event = void 0;

var Event;
(function (Event) {
    const _disposable = { dispose() { } };
    Event.None = function () { return _disposable; };
})(Event = exports.Event || (exports.Event = {}));
class CallbackList {
    add(callback, context = null, bucket) {
        if (!this._callbacks) {
            this._callbacks = [];
            this._contexts = [];
        }
        this._callbacks.push(callback);
        this._contexts.push(context);
        if (Array.isArray(bucket)) {
            bucket.push({ dispose: () => this.remove(callback, context) });
        }
    }
    remove(callback, context = null) {
        if (!this._callbacks) {
            return;
        }
        let foundCallbackWithDifferentContext = false;
        for (let i = 0, len = this._callbacks.length; i < len; i++) {
            if (this._callbacks[i] === callback) {
                if (this._contexts[i] === context) {
                    // callback & context match => remove it
                    this._callbacks.splice(i, 1);
                    this._contexts.splice(i, 1);
                    return;
                }
                else {
                    foundCallbackWithDifferentContext = true;
                }
            }
        }
        if (foundCallbackWithDifferentContext) {
            throw new Error('When adding a listener with a context, you should remove it with the same context');
        }
    }
    invoke(...args) {
        if (!this._callbacks) {
            return [];
        }
        const ret = [], callbacks = this._callbacks.slice(0), contexts = this._contexts.slice(0);
        for (let i = 0, len = callbacks.length; i < len; i++) {
            try {
                ret.push(callbacks[i].apply(contexts[i], args));
            }
            catch (e) {
                // eslint-disable-next-line no-console
                ral.default().console.error(e);
            }
        }
        return ret;
    }
    isEmpty() {
        return !this._callbacks || this._callbacks.length === 0;
    }
    dispose() {
        this._callbacks = undefined;
        this._contexts = undefined;
    }
}
class Emitter {
    constructor(_options) {
        this._options = _options;
    }
    /**
     * For the public to allow to subscribe
     * to events from this Emitter
     */
    get event() {
        if (!this._event) {
            this._event = (listener, thisArgs, disposables) => {
                if (!this._callbacks) {
                    this._callbacks = new CallbackList();
                }
                if (this._options && this._options.onFirstListenerAdd && this._callbacks.isEmpty()) {
                    this._options.onFirstListenerAdd(this);
                }
                this._callbacks.add(listener, thisArgs);
                const result = {
                    dispose: () => {
                        if (!this._callbacks) {
                            // disposable is disposed after emitter is disposed.
                            return;
                        }
                        this._callbacks.remove(listener, thisArgs);
                        result.dispose = Emitter._noop;
                        if (this._options && this._options.onLastListenerRemove && this._callbacks.isEmpty()) {
                            this._options.onLastListenerRemove(this);
                        }
                    }
                };
                if (Array.isArray(disposables)) {
                    disposables.push(result);
                }
                return result;
            };
        }
        return this._event;
    }
    /**
     * To be kept private to fire an event to
     * subscribers
     */
    fire(event) {
        if (this._callbacks) {
            this._callbacks.invoke.call(this._callbacks, event);
        }
    }
    dispose() {
        if (this._callbacks) {
            this._callbacks.dispose();
            this._callbacks = undefined;
        }
    }
}
exports.Emitter = Emitter;
Emitter._noop = function () { };

});

var cancellation = createCommonjsModule(function (module, exports) {
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.CancellationTokenSource = exports.CancellationToken = void 0;



var CancellationToken;
(function (CancellationToken) {
    CancellationToken.None = Object.freeze({
        isCancellationRequested: false,
        onCancellationRequested: events.Event.None
    });
    CancellationToken.Cancelled = Object.freeze({
        isCancellationRequested: true,
        onCancellationRequested: events.Event.None
    });
    function is(value) {
        const candidate = value;
        return candidate && (candidate === CancellationToken.None
            || candidate === CancellationToken.Cancelled
            || (is$1.boolean(candidate.isCancellationRequested) && !!candidate.onCancellationRequested));
    }
    CancellationToken.is = is;
})(CancellationToken = exports.CancellationToken || (exports.CancellationToken = {}));
const shortcutEvent = Object.freeze(function (callback, context) {
    const handle = ral.default().timer.setTimeout(callback.bind(context), 0);
    return { dispose() { ral.default().timer.clearTimeout(handle); } };
});
class MutableToken {
    constructor() {
        this._isCancelled = false;
    }
    cancel() {
        if (!this._isCancelled) {
            this._isCancelled = true;
            if (this._emitter) {
                this._emitter.fire(undefined);
                this.dispose();
            }
        }
    }
    get isCancellationRequested() {
        return this._isCancelled;
    }
    get onCancellationRequested() {
        if (this._isCancelled) {
            return shortcutEvent;
        }
        if (!this._emitter) {
            this._emitter = new events.Emitter();
        }
        return this._emitter.event;
    }
    dispose() {
        if (this._emitter) {
            this._emitter.dispose();
            this._emitter = undefined;
        }
    }
}
class CancellationTokenSource {
    get token() {
        if (!this._token) {
            // be lazy and create the token only when
            // actually needed
            this._token = new MutableToken();
        }
        return this._token;
    }
    cancel() {
        if (!this._token) {
            // save an object by returning the default
            // cancelled token when cancellation happens
            // before someone asks for the token
            this._token = CancellationToken.Cancelled;
        }
        else {
            this._token.cancel();
        }
    }
    dispose() {
        if (!this._token) {
            // ensure to initialize with an empty token if we had none
            this._token = CancellationToken.None;
        }
        else if (this._token instanceof MutableToken) {
            // actually dispose
            this._token.dispose();
        }
    }
}
exports.CancellationTokenSource = CancellationTokenSource;

});

var messageReader = createCommonjsModule(function (module, exports) {
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadableStreamMessageReader = exports.AbstractMessageReader = exports.MessageReader = void 0;



var MessageReader;
(function (MessageReader) {
    function is(value) {
        let candidate = value;
        return candidate && is$1.func(candidate.listen) && is$1.func(candidate.dispose) &&
            is$1.func(candidate.onError) && is$1.func(candidate.onClose) && is$1.func(candidate.onPartialMessage);
    }
    MessageReader.is = is;
})(MessageReader = exports.MessageReader || (exports.MessageReader = {}));
class AbstractMessageReader {
    constructor() {
        this.errorEmitter = new events.Emitter();
        this.closeEmitter = new events.Emitter();
        this.partialMessageEmitter = new events.Emitter();
    }
    dispose() {
        this.errorEmitter.dispose();
        this.closeEmitter.dispose();
    }
    get onError() {
        return this.errorEmitter.event;
    }
    fireError(error) {
        this.errorEmitter.fire(this.asError(error));
    }
    get onClose() {
        return this.closeEmitter.event;
    }
    fireClose() {
        this.closeEmitter.fire(undefined);
    }
    get onPartialMessage() {
        return this.partialMessageEmitter.event;
    }
    firePartialMessage(info) {
        this.partialMessageEmitter.fire(info);
    }
    asError(error) {
        if (error instanceof Error) {
            return error;
        }
        else {
            return new Error(`Reader received error. Reason: ${is$1.string(error.message) ? error.message : 'unknown'}`);
        }
    }
}
exports.AbstractMessageReader = AbstractMessageReader;
var ResolvedMessageReaderOptions;
(function (ResolvedMessageReaderOptions) {
    function fromOptions(options) {
        var _a;
        let charset;
        let contentDecoder;
        const contentDecoders = new Map();
        let contentTypeDecoder;
        const contentTypeDecoders = new Map();
        if (options === undefined || typeof options === 'string') {
            charset = options !== null && options !== void 0 ? options : 'utf-8';
        }
        else {
            charset = (_a = options.charset) !== null && _a !== void 0 ? _a : 'utf-8';
            if (options.contentDecoder !== undefined) {
                contentDecoder = options.contentDecoder;
                contentDecoders.set(contentDecoder.name, contentDecoder);
            }
            if (options.contentDecoders !== undefined) {
                for (const decoder of options.contentDecoders) {
                    contentDecoders.set(decoder.name, decoder);
                }
            }
            if (options.contentTypeDecoder !== undefined) {
                contentTypeDecoder = options.contentTypeDecoder;
                contentTypeDecoders.set(contentTypeDecoder.name, contentTypeDecoder);
            }
            if (options.contentTypeDecoders !== undefined) {
                for (const decoder of options.contentTypeDecoders) {
                    contentTypeDecoders.set(decoder.name, decoder);
                }
            }
        }
        if (contentTypeDecoder === undefined) {
            contentTypeDecoder = ral.default().applicationJson.decoder;
            contentTypeDecoders.set(contentTypeDecoder.name, contentTypeDecoder);
        }
        return { charset, contentDecoder, contentDecoders, contentTypeDecoder, contentTypeDecoders };
    }
    ResolvedMessageReaderOptions.fromOptions = fromOptions;
})(ResolvedMessageReaderOptions || (ResolvedMessageReaderOptions = {}));
class ReadableStreamMessageReader extends AbstractMessageReader {
    constructor(readable, options) {
        super();
        this.readable = readable;
        this.options = ResolvedMessageReaderOptions.fromOptions(options);
        this.buffer = ral.default().messageBuffer.create(this.options.charset);
        this._partialMessageTimeout = 10000;
        this.nextMessageLength = -1;
        this.messageToken = 0;
    }
    set partialMessageTimeout(timeout) {
        this._partialMessageTimeout = timeout;
    }
    get partialMessageTimeout() {
        return this._partialMessageTimeout;
    }
    listen(callback) {
        this.nextMessageLength = -1;
        this.messageToken = 0;
        this.partialMessageTimer = undefined;
        this.callback = callback;
        const result = this.readable.onData((data) => {
            this.onData(data);
        });
        this.readable.onError((error) => this.fireError(error));
        this.readable.onClose(() => this.fireClose());
        return result;
    }
    onData(data) {
        this.buffer.append(data);
        while (true) {
            if (this.nextMessageLength === -1) {
                const headers = this.buffer.tryReadHeaders();
                if (!headers) {
                    return;
                }
                const contentLength = headers.get('Content-Length');
                if (!contentLength) {
                    throw new Error('Header must provide a Content-Length property.');
                }
                const length = parseInt(contentLength);
                if (isNaN(length)) {
                    throw new Error('Content-Length value must be a number.');
                }
                this.nextMessageLength = length;
            }
            const body = this.buffer.tryReadBody(this.nextMessageLength);
            if (body === undefined) {
                /** We haven't received the full message yet. */
                this.setPartialMessageTimer();
                return;
            }
            this.clearPartialMessageTimer();
            this.nextMessageLength = -1;
            let p;
            if (this.options.contentDecoder !== undefined) {
                p = this.options.contentDecoder.decode(body);
            }
            else {
                p = Promise.resolve(body);
            }
            p.then((value) => {
                this.options.contentTypeDecoder.decode(value, this.options).then((msg) => {
                    this.callback(msg);
                }, (error) => {
                    this.fireError(error);
                });
            }, (error) => {
                this.fireError(error);
            });
        }
    }
    clearPartialMessageTimer() {
        if (this.partialMessageTimer) {
            ral.default().timer.clearTimeout(this.partialMessageTimer);
            this.partialMessageTimer = undefined;
        }
    }
    setPartialMessageTimer() {
        this.clearPartialMessageTimer();
        if (this._partialMessageTimeout <= 0) {
            return;
        }
        this.partialMessageTimer = ral.default().timer.setTimeout((token, timeout) => {
            this.partialMessageTimer = undefined;
            if (token === this.messageToken) {
                this.firePartialMessage({ messageToken: token, waitingTime: timeout });
                this.setPartialMessageTimer();
            }
        }, this._partialMessageTimeout, this.messageToken, this._partialMessageTimeout);
    }
}
exports.ReadableStreamMessageReader = ReadableStreamMessageReader;

});

var semaphore = createCommonjsModule(function (module, exports) {
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Semaphore = void 0;

class Semaphore {
    constructor(capacity = 1) {
        if (capacity <= 0) {
            throw new Error('Capacity must be greater than 0');
        }
        this._capacity = capacity;
        this._active = 0;
        this._waiting = [];
    }
    lock(thunk) {
        return new Promise((resolve, reject) => {
            this._waiting.push({ thunk, resolve, reject });
            this.runNext();
        });
    }
    get active() {
        return this._active;
    }
    runNext() {
        if (this._waiting.length === 0 || this._active === this._capacity) {
            return;
        }
        ral.default().timer.setImmediate(() => this.doRunNext());
    }
    doRunNext() {
        if (this._waiting.length === 0 || this._active === this._capacity) {
            return;
        }
        const next = this._waiting.shift();
        this._active++;
        if (this._active > this._capacity) {
            throw new Error(`To many thunks active`);
        }
        try {
            const result = next.thunk();
            if (result instanceof Promise) {
                result.then((value) => {
                    this._active--;
                    next.resolve(value);
                    this.runNext();
                }, (err) => {
                    this._active--;
                    next.reject(err);
                    this.runNext();
                });
            }
            else {
                this._active--;
                next.resolve(result);
                this.runNext();
            }
        }
        catch (err) {
            this._active--;
            next.reject(err);
            this.runNext();
        }
    }
}
exports.Semaphore = Semaphore;

});

var messageWriter = createCommonjsModule(function (module, exports) {
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
Object.defineProperty(exports, "__esModule", { value: true });
exports.WriteableStreamMessageWriter = exports.AbstractMessageWriter = exports.MessageWriter = void 0;




const ContentLength = 'Content-Length: ';
const CRLF = '\r\n';
var MessageWriter;
(function (MessageWriter) {
    function is(value) {
        let candidate = value;
        return candidate && is$1.func(candidate.dispose) && is$1.func(candidate.onClose) &&
            is$1.func(candidate.onError) && is$1.func(candidate.write);
    }
    MessageWriter.is = is;
})(MessageWriter = exports.MessageWriter || (exports.MessageWriter = {}));
class AbstractMessageWriter {
    constructor() {
        this.errorEmitter = new events.Emitter();
        this.closeEmitter = new events.Emitter();
    }
    dispose() {
        this.errorEmitter.dispose();
        this.closeEmitter.dispose();
    }
    get onError() {
        return this.errorEmitter.event;
    }
    fireError(error, message, count) {
        this.errorEmitter.fire([this.asError(error), message, count]);
    }
    get onClose() {
        return this.closeEmitter.event;
    }
    fireClose() {
        this.closeEmitter.fire(undefined);
    }
    asError(error) {
        if (error instanceof Error) {
            return error;
        }
        else {
            return new Error(`Writer received error. Reason: ${is$1.string(error.message) ? error.message : 'unknown'}`);
        }
    }
}
exports.AbstractMessageWriter = AbstractMessageWriter;
var ResolvedMessageWriterOptions;
(function (ResolvedMessageWriterOptions) {
    function fromOptions(options) {
        var _a, _b;
        if (options === undefined || typeof options === 'string') {
            return { charset: options !== null && options !== void 0 ? options : 'utf-8', contentTypeEncoder: ral.default().applicationJson.encoder };
        }
        else {
            return { charset: (_a = options.charset) !== null && _a !== void 0 ? _a : 'utf-8', contentEncoder: options.contentEncoder, contentTypeEncoder: (_b = options.contentTypeEncoder) !== null && _b !== void 0 ? _b : ral.default().applicationJson.encoder };
        }
    }
    ResolvedMessageWriterOptions.fromOptions = fromOptions;
})(ResolvedMessageWriterOptions || (ResolvedMessageWriterOptions = {}));
class WriteableStreamMessageWriter extends AbstractMessageWriter {
    constructor(writable, options) {
        super();
        this.writable = writable;
        this.options = ResolvedMessageWriterOptions.fromOptions(options);
        this.errorCount = 0;
        this.writeSemaphore = new semaphore.Semaphore(1);
        this.writable.onError((error) => this.fireError(error));
        this.writable.onClose(() => this.fireClose());
    }
    async write(msg) {
        return this.writeSemaphore.lock(async () => {
            const payload = this.options.contentTypeEncoder.encode(msg, this.options).then((buffer) => {
                if (this.options.contentEncoder !== undefined) {
                    return this.options.contentEncoder.encode(buffer);
                }
                else {
                    return buffer;
                }
            });
            return payload.then((buffer) => {
                const headers = [];
                headers.push(ContentLength, buffer.byteLength.toString(), CRLF);
                headers.push(CRLF);
                return this.doWrite(msg, headers, buffer);
            }, (error) => {
                this.fireError(error);
                throw error;
            });
        });
    }
    async doWrite(msg, headers, data) {
        try {
            await this.writable.write(headers.join(''), 'ascii');
            return this.writable.write(data);
        }
        catch (error) {
            this.handleError(error, msg);
            return Promise.reject(error);
        }
    }
    handleError(error, msg) {
        this.errorCount++;
        this.fireError(error, msg, this.errorCount);
    }
    end() {
        this.writable.end();
    }
}
exports.WriteableStreamMessageWriter = WriteableStreamMessageWriter;

});

var linkedMap = createCommonjsModule(function (module, exports) {
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.LRUCache = exports.LinkedMap = exports.Touch = void 0;
var Touch;
(function (Touch) {
    Touch.None = 0;
    Touch.First = 1;
    Touch.AsOld = Touch.First;
    Touch.Last = 2;
    Touch.AsNew = Touch.Last;
})(Touch = exports.Touch || (exports.Touch = {}));
class LinkedMap {
    constructor() {
        this[Symbol.toStringTag] = 'LinkedMap';
        this._map = new Map();
        this._head = undefined;
        this._tail = undefined;
        this._size = 0;
        this._state = 0;
    }
    clear() {
        this._map.clear();
        this._head = undefined;
        this._tail = undefined;
        this._size = 0;
        this._state++;
    }
    isEmpty() {
        return !this._head && !this._tail;
    }
    get size() {
        return this._size;
    }
    get first() {
        var _a;
        return (_a = this._head) === null || _a === void 0 ? void 0 : _a.value;
    }
    get last() {
        var _a;
        return (_a = this._tail) === null || _a === void 0 ? void 0 : _a.value;
    }
    has(key) {
        return this._map.has(key);
    }
    get(key, touch = Touch.None) {
        const item = this._map.get(key);
        if (!item) {
            return undefined;
        }
        if (touch !== Touch.None) {
            this.touch(item, touch);
        }
        return item.value;
    }
    set(key, value, touch = Touch.None) {
        let item = this._map.get(key);
        if (item) {
            item.value = value;
            if (touch !== Touch.None) {
                this.touch(item, touch);
            }
        }
        else {
            item = { key, value, next: undefined, previous: undefined };
            switch (touch) {
                case Touch.None:
                    this.addItemLast(item);
                    break;
                case Touch.First:
                    this.addItemFirst(item);
                    break;
                case Touch.Last:
                    this.addItemLast(item);
                    break;
                default:
                    this.addItemLast(item);
                    break;
            }
            this._map.set(key, item);
            this._size++;
        }
        return this;
    }
    delete(key) {
        return !!this.remove(key);
    }
    remove(key) {
        const item = this._map.get(key);
        if (!item) {
            return undefined;
        }
        this._map.delete(key);
        this.removeItem(item);
        this._size--;
        return item.value;
    }
    shift() {
        if (!this._head && !this._tail) {
            return undefined;
        }
        if (!this._head || !this._tail) {
            throw new Error('Invalid list');
        }
        const item = this._head;
        this._map.delete(item.key);
        this.removeItem(item);
        this._size--;
        return item.value;
    }
    forEach(callbackfn, thisArg) {
        const state = this._state;
        let current = this._head;
        while (current) {
            if (thisArg) {
                callbackfn.bind(thisArg)(current.value, current.key, this);
            }
            else {
                callbackfn(current.value, current.key, this);
            }
            if (this._state !== state) {
                throw new Error(`LinkedMap got modified during iteration.`);
            }
            current = current.next;
        }
    }
    keys() {
        const map = this;
        const state = this._state;
        let current = this._head;
        const iterator = {
            [Symbol.iterator]() {
                return iterator;
            },
            next() {
                if (map._state !== state) {
                    throw new Error(`LinkedMap got modified during iteration.`);
                }
                if (current) {
                    const result = { value: current.key, done: false };
                    current = current.next;
                    return result;
                }
                else {
                    return { value: undefined, done: true };
                }
            }
        };
        return iterator;
    }
    values() {
        const map = this;
        const state = this._state;
        let current = this._head;
        const iterator = {
            [Symbol.iterator]() {
                return iterator;
            },
            next() {
                if (map._state !== state) {
                    throw new Error(`LinkedMap got modified during iteration.`);
                }
                if (current) {
                    const result = { value: current.value, done: false };
                    current = current.next;
                    return result;
                }
                else {
                    return { value: undefined, done: true };
                }
            }
        };
        return iterator;
    }
    entries() {
        const map = this;
        const state = this._state;
        let current = this._head;
        const iterator = {
            [Symbol.iterator]() {
                return iterator;
            },
            next() {
                if (map._state !== state) {
                    throw new Error(`LinkedMap got modified during iteration.`);
                }
                if (current) {
                    const result = { value: [current.key, current.value], done: false };
                    current = current.next;
                    return result;
                }
                else {
                    return { value: undefined, done: true };
                }
            }
        };
        return iterator;
    }
    [Symbol.iterator]() {
        return this.entries();
    }
    trimOld(newSize) {
        if (newSize >= this.size) {
            return;
        }
        if (newSize === 0) {
            this.clear();
            return;
        }
        let current = this._head;
        let currentSize = this.size;
        while (current && currentSize > newSize) {
            this._map.delete(current.key);
            current = current.next;
            currentSize--;
        }
        this._head = current;
        this._size = currentSize;
        if (current) {
            current.previous = undefined;
        }
        this._state++;
    }
    addItemFirst(item) {
        // First time Insert
        if (!this._head && !this._tail) {
            this._tail = item;
        }
        else if (!this._head) {
            throw new Error('Invalid list');
        }
        else {
            item.next = this._head;
            this._head.previous = item;
        }
        this._head = item;
        this._state++;
    }
    addItemLast(item) {
        // First time Insert
        if (!this._head && !this._tail) {
            this._head = item;
        }
        else if (!this._tail) {
            throw new Error('Invalid list');
        }
        else {
            item.previous = this._tail;
            this._tail.next = item;
        }
        this._tail = item;
        this._state++;
    }
    removeItem(item) {
        if (item === this._head && item === this._tail) {
            this._head = undefined;
            this._tail = undefined;
        }
        else if (item === this._head) {
            // This can only happend if size === 1 which is handle
            // by the case above.
            if (!item.next) {
                throw new Error('Invalid list');
            }
            item.next.previous = undefined;
            this._head = item.next;
        }
        else if (item === this._tail) {
            // This can only happend if size === 1 which is handle
            // by the case above.
            if (!item.previous) {
                throw new Error('Invalid list');
            }
            item.previous.next = undefined;
            this._tail = item.previous;
        }
        else {
            const next = item.next;
            const previous = item.previous;
            if (!next || !previous) {
                throw new Error('Invalid list');
            }
            next.previous = previous;
            previous.next = next;
        }
        item.next = undefined;
        item.previous = undefined;
        this._state++;
    }
    touch(item, touch) {
        if (!this._head || !this._tail) {
            throw new Error('Invalid list');
        }
        if ((touch !== Touch.First && touch !== Touch.Last)) {
            return;
        }
        if (touch === Touch.First) {
            if (item === this._head) {
                return;
            }
            const next = item.next;
            const previous = item.previous;
            // Unlink the item
            if (item === this._tail) {
                // previous must be defined since item was not head but is tail
                // So there are more than on item in the map
                previous.next = undefined;
                this._tail = previous;
            }
            else {
                // Both next and previous are not undefined since item was neither head nor tail.
                next.previous = previous;
                previous.next = next;
            }
            // Insert the node at head
            item.previous = undefined;
            item.next = this._head;
            this._head.previous = item;
            this._head = item;
            this._state++;
        }
        else if (touch === Touch.Last) {
            if (item === this._tail) {
                return;
            }
            const next = item.next;
            const previous = item.previous;
            // Unlink the item.
            if (item === this._head) {
                // next must be defined since item was not tail but is head
                // So there are more than on item in the map
                next.previous = undefined;
                this._head = next;
            }
            else {
                // Both next and previous are not undefined since item was neither head nor tail.
                next.previous = previous;
                previous.next = next;
            }
            item.next = undefined;
            item.previous = this._tail;
            this._tail.next = item;
            this._tail = item;
            this._state++;
        }
    }
    toJSON() {
        const data = [];
        this.forEach((value, key) => {
            data.push([key, value]);
        });
        return data;
    }
    fromJSON(data) {
        this.clear();
        for (const [key, value] of data) {
            this.set(key, value);
        }
    }
}
exports.LinkedMap = LinkedMap;
class LRUCache extends LinkedMap {
    constructor(limit, ratio = 1) {
        super();
        this._limit = limit;
        this._ratio = Math.min(Math.max(0, ratio), 1);
    }
    get limit() {
        return this._limit;
    }
    set limit(limit) {
        this._limit = limit;
        this.checkTrim();
    }
    get ratio() {
        return this._ratio;
    }
    set ratio(ratio) {
        this._ratio = Math.min(Math.max(0, ratio), 1);
        this.checkTrim();
    }
    get(key, touch = Touch.AsNew) {
        return super.get(key, touch);
    }
    peek(key) {
        return super.get(key, Touch.None);
    }
    set(key, value) {
        super.set(key, value, Touch.Last);
        this.checkTrim();
        return this;
    }
    checkTrim() {
        if (this.size > this._limit) {
            this.trimOld(Math.round(this._limit * this._ratio));
        }
    }
}
exports.LRUCache = LRUCache;

});

var connection = createCommonjsModule(function (module, exports) {
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMessageConnection = exports.ConnectionOptions = exports.CancellationStrategy = exports.CancellationSenderStrategy = exports.CancellationReceiverStrategy = exports.ConnectionStrategy = exports.ConnectionError = exports.ConnectionErrors = exports.LogTraceNotification = exports.SetTraceNotification = exports.TraceFormat = exports.Trace = exports.NullLogger = exports.ProgressType = void 0;






var CancelNotification;
(function (CancelNotification) {
    CancelNotification.type = new messages.NotificationType('$/cancelRequest');
})(CancelNotification || (CancelNotification = {}));
var ProgressNotification;
(function (ProgressNotification) {
    ProgressNotification.type = new messages.NotificationType('$/progress');
})(ProgressNotification || (ProgressNotification = {}));
class ProgressType {
    constructor() {
    }
}
exports.ProgressType = ProgressType;
var StarRequestHandler;
(function (StarRequestHandler) {
    function is(value) {
        return is$1.func(value);
    }
    StarRequestHandler.is = is;
})(StarRequestHandler || (StarRequestHandler = {}));
exports.NullLogger = Object.freeze({
    error: () => { },
    warn: () => { },
    info: () => { },
    log: () => { }
});
var Trace;
(function (Trace) {
    Trace[Trace["Off"] = 0] = "Off";
    Trace[Trace["Messages"] = 1] = "Messages";
    Trace[Trace["Verbose"] = 2] = "Verbose";
})(Trace = exports.Trace || (exports.Trace = {}));
(function (Trace) {
    function fromString(value) {
        if (!is$1.string(value)) {
            return Trace.Off;
        }
        value = value.toLowerCase();
        switch (value) {
            case 'off':
                return Trace.Off;
            case 'messages':
                return Trace.Messages;
            case 'verbose':
                return Trace.Verbose;
            default:
                return Trace.Off;
        }
    }
    Trace.fromString = fromString;
    function toString(value) {
        switch (value) {
            case Trace.Off:
                return 'off';
            case Trace.Messages:
                return 'messages';
            case Trace.Verbose:
                return 'verbose';
            default:
                return 'off';
        }
    }
    Trace.toString = toString;
})(Trace = exports.Trace || (exports.Trace = {}));
var TraceFormat;
(function (TraceFormat) {
    TraceFormat["Text"] = "text";
    TraceFormat["JSON"] = "json";
})(TraceFormat = exports.TraceFormat || (exports.TraceFormat = {}));
(function (TraceFormat) {
    function fromString(value) {
        value = value.toLowerCase();
        if (value === 'json') {
            return TraceFormat.JSON;
        }
        else {
            return TraceFormat.Text;
        }
    }
    TraceFormat.fromString = fromString;
})(TraceFormat = exports.TraceFormat || (exports.TraceFormat = {}));
var SetTraceNotification;
(function (SetTraceNotification) {
    SetTraceNotification.type = new messages.NotificationType('$/setTrace');
})(SetTraceNotification = exports.SetTraceNotification || (exports.SetTraceNotification = {}));
var LogTraceNotification;
(function (LogTraceNotification) {
    LogTraceNotification.type = new messages.NotificationType('$/logTrace');
})(LogTraceNotification = exports.LogTraceNotification || (exports.LogTraceNotification = {}));
var ConnectionErrors;
(function (ConnectionErrors) {
    /**
     * The connection is closed.
     */
    ConnectionErrors[ConnectionErrors["Closed"] = 1] = "Closed";
    /**
     * The connection got disposed.
     */
    ConnectionErrors[ConnectionErrors["Disposed"] = 2] = "Disposed";
    /**
     * The connection is already in listening mode.
     */
    ConnectionErrors[ConnectionErrors["AlreadyListening"] = 3] = "AlreadyListening";
})(ConnectionErrors = exports.ConnectionErrors || (exports.ConnectionErrors = {}));
class ConnectionError extends Error {
    constructor(code, message) {
        super(message);
        this.code = code;
        Object.setPrototypeOf(this, ConnectionError.prototype);
    }
}
exports.ConnectionError = ConnectionError;
var ConnectionStrategy;
(function (ConnectionStrategy) {
    function is(value) {
        const candidate = value;
        return candidate && is$1.func(candidate.cancelUndispatched);
    }
    ConnectionStrategy.is = is;
})(ConnectionStrategy = exports.ConnectionStrategy || (exports.ConnectionStrategy = {}));
var CancellationReceiverStrategy;
(function (CancellationReceiverStrategy) {
    CancellationReceiverStrategy.Message = Object.freeze({
        createCancellationTokenSource(_) {
            return new cancellation.CancellationTokenSource();
        }
    });
    function is(value) {
        const candidate = value;
        return candidate && is$1.func(candidate.createCancellationTokenSource);
    }
    CancellationReceiverStrategy.is = is;
})(CancellationReceiverStrategy = exports.CancellationReceiverStrategy || (exports.CancellationReceiverStrategy = {}));
var CancellationSenderStrategy;
(function (CancellationSenderStrategy) {
    CancellationSenderStrategy.Message = Object.freeze({
        sendCancellation(conn, id) {
            conn.sendNotification(CancelNotification.type, { id });
        },
        cleanup(_) { }
    });
    function is(value) {
        const candidate = value;
        return candidate && is$1.func(candidate.sendCancellation) && is$1.func(candidate.cleanup);
    }
    CancellationSenderStrategy.is = is;
})(CancellationSenderStrategy = exports.CancellationSenderStrategy || (exports.CancellationSenderStrategy = {}));
var CancellationStrategy;
(function (CancellationStrategy) {
    CancellationStrategy.Message = Object.freeze({
        receiver: CancellationReceiverStrategy.Message,
        sender: CancellationSenderStrategy.Message
    });
    function is(value) {
        const candidate = value;
        return candidate && CancellationReceiverStrategy.is(candidate.receiver) && CancellationSenderStrategy.is(candidate.sender);
    }
    CancellationStrategy.is = is;
})(CancellationStrategy = exports.CancellationStrategy || (exports.CancellationStrategy = {}));
var ConnectionOptions;
(function (ConnectionOptions) {
    function is(value) {
        const candidate = value;
        return candidate && (CancellationStrategy.is(candidate.cancellationStrategy) || ConnectionStrategy.is(candidate.connectionStrategy));
    }
    ConnectionOptions.is = is;
})(ConnectionOptions = exports.ConnectionOptions || (exports.ConnectionOptions = {}));
var ConnectionState;
(function (ConnectionState) {
    ConnectionState[ConnectionState["New"] = 1] = "New";
    ConnectionState[ConnectionState["Listening"] = 2] = "Listening";
    ConnectionState[ConnectionState["Closed"] = 3] = "Closed";
    ConnectionState[ConnectionState["Disposed"] = 4] = "Disposed";
})(ConnectionState || (ConnectionState = {}));
function createMessageConnection(messageReader, messageWriter, _logger, options) {
    const logger = _logger !== undefined ? _logger : exports.NullLogger;
    let sequenceNumber = 0;
    let notificationSquenceNumber = 0;
    let unknownResponseSquenceNumber = 0;
    const version = '2.0';
    let starRequestHandler = undefined;
    const requestHandlers = Object.create(null);
    let starNotificationHandler = undefined;
    const notificationHandlers = Object.create(null);
    const progressHandlers = new Map();
    let timer;
    let messageQueue = new linkedMap.LinkedMap();
    let responsePromises = Object.create(null);
    let requestTokens = Object.create(null);
    let trace = Trace.Off;
    let traceFormat = TraceFormat.Text;
    let tracer;
    let state = ConnectionState.New;
    const errorEmitter = new events.Emitter();
    const closeEmitter = new events.Emitter();
    const unhandledNotificationEmitter = new events.Emitter();
    const unhandledProgressEmitter = new events.Emitter();
    const disposeEmitter = new events.Emitter();
    const cancellationStrategy = (options && options.cancellationStrategy) ? options.cancellationStrategy : CancellationStrategy.Message;
    function createRequestQueueKey(id) {
        if (id === null) {
            throw new Error(`Can't send requests with id null since the response can't be correlated.`);
        }
        return 'req-' + id.toString();
    }
    function createResponseQueueKey(id) {
        if (id === null) {
            return 'res-unknown-' + (++unknownResponseSquenceNumber).toString();
        }
        else {
            return 'res-' + id.toString();
        }
    }
    function createNotificationQueueKey() {
        return 'not-' + (++notificationSquenceNumber).toString();
    }
    function addMessageToQueue(queue, message) {
        if (messages.isRequestMessage(message)) {
            queue.set(createRequestQueueKey(message.id), message);
        }
        else if (messages.isResponseMessage(message)) {
            queue.set(createResponseQueueKey(message.id), message);
        }
        else {
            queue.set(createNotificationQueueKey(), message);
        }
    }
    function cancelUndispatched(_message) {
        return undefined;
    }
    function isListening() {
        return state === ConnectionState.Listening;
    }
    function isClosed() {
        return state === ConnectionState.Closed;
    }
    function isDisposed() {
        return state === ConnectionState.Disposed;
    }
    function closeHandler() {
        if (state === ConnectionState.New || state === ConnectionState.Listening) {
            state = ConnectionState.Closed;
            closeEmitter.fire(undefined);
        }
        // If the connection is disposed don't sent close events.
    }
    function readErrorHandler(error) {
        errorEmitter.fire([error, undefined, undefined]);
    }
    function writeErrorHandler(data) {
        errorEmitter.fire(data);
    }
    messageReader.onClose(closeHandler);
    messageReader.onError(readErrorHandler);
    messageWriter.onClose(closeHandler);
    messageWriter.onError(writeErrorHandler);
    function triggerMessageQueue() {
        if (timer || messageQueue.size === 0) {
            return;
        }
        timer = ral.default().timer.setImmediate(() => {
            timer = undefined;
            processMessageQueue();
        });
    }
    function processMessageQueue() {
        if (messageQueue.size === 0) {
            return;
        }
        const message = messageQueue.shift();
        try {
            if (messages.isRequestMessage(message)) {
                handleRequest(message);
            }
            else if (messages.isNotificationMessage(message)) {
                handleNotification(message);
            }
            else if (messages.isResponseMessage(message)) {
                handleResponse(message);
            }
            else {
                handleInvalidMessage(message);
            }
        }
        finally {
            triggerMessageQueue();
        }
    }
    const callback = (message) => {
        try {
            // We have received a cancellation message. Check if the message is still in the queue
            // and cancel it if allowed to do so.
            if (messages.isNotificationMessage(message) && message.method === CancelNotification.type.method) {
                const key = createRequestQueueKey(message.params.id);
                const toCancel = messageQueue.get(key);
                if (messages.isRequestMessage(toCancel)) {
                    const strategy = options === null || options === void 0 ? void 0 : options.connectionStrategy;
                    const response = (strategy && strategy.cancelUndispatched) ? strategy.cancelUndispatched(toCancel, cancelUndispatched) : cancelUndispatched(toCancel);
                    if (response && (response.error !== undefined || response.result !== undefined)) {
                        messageQueue.delete(key);
                        response.id = toCancel.id;
                        traceSendingResponse(response, message.method, Date.now());
                        messageWriter.write(response);
                        return;
                    }
                }
            }
            addMessageToQueue(messageQueue, message);
        }
        finally {
            triggerMessageQueue();
        }
    };
    function handleRequest(requestMessage) {
        if (isDisposed()) {
            // we return here silently since we fired an event when the
            // connection got disposed.
            return;
        }
        function reply(resultOrError, method, startTime) {
            const message = {
                jsonrpc: version,
                id: requestMessage.id
            };
            if (resultOrError instanceof messages.ResponseError) {
                message.error = resultOrError.toJson();
            }
            else {
                message.result = resultOrError === undefined ? null : resultOrError;
            }
            traceSendingResponse(message, method, startTime);
            messageWriter.write(message);
        }
        function replyError(error, method, startTime) {
            const message = {
                jsonrpc: version,
                id: requestMessage.id,
                error: error.toJson()
            };
            traceSendingResponse(message, method, startTime);
            messageWriter.write(message);
        }
        function replySuccess(result, method, startTime) {
            // The JSON RPC defines that a response must either have a result or an error
            // So we can't treat undefined as a valid response result.
            if (result === undefined) {
                result = null;
            }
            const message = {
                jsonrpc: version,
                id: requestMessage.id,
                result: result
            };
            traceSendingResponse(message, method, startTime);
            messageWriter.write(message);
        }
        traceReceivedRequest(requestMessage);
        const element = requestHandlers[requestMessage.method];
        let type;
        let requestHandler;
        if (element) {
            type = element.type;
            requestHandler = element.handler;
        }
        const startTime = Date.now();
        if (requestHandler || starRequestHandler) {
            const tokenKey = String(requestMessage.id);
            const cancellationSource = cancellationStrategy.receiver.createCancellationTokenSource(tokenKey);
            requestTokens[tokenKey] = cancellationSource;
            try {
                let handlerResult;
                if (requestHandler) {
                    if (requestMessage.params === undefined) {
                        if (type !== undefined && type.numberOfParams !== 0) {
                            replyError(new messages.ResponseError(messages.ErrorCodes.InvalidParams, `Request ${requestMessage.method} defines ${type.numberOfParams} params but recevied none.`), requestMessage.method, startTime);
                            return;
                        }
                        handlerResult = requestHandler(cancellationSource.token);
                    }
                    else if (Array.isArray(requestMessage.params)) {
                        if (type !== undefined && type.parameterStructures === messages.ParameterStructures.byName) {
                            replyError(new messages.ResponseError(messages.ErrorCodes.InvalidParams, `Request ${requestMessage.method} defines parameters by name but received parameters by position`), requestMessage.method, startTime);
                            return;
                        }
                        handlerResult = requestHandler(...requestMessage.params, cancellationSource.token);
                    }
                    else {
                        if (type !== undefined && type.parameterStructures === messages.ParameterStructures.byPosition) {
                            replyError(new messages.ResponseError(messages.ErrorCodes.InvalidParams, `Request ${requestMessage.method} defines parameters by position but received parameters by name`), requestMessage.method, startTime);
                            return;
                        }
                        handlerResult = requestHandler(requestMessage.params, cancellationSource.token);
                    }
                }
                else if (starRequestHandler) {
                    handlerResult = starRequestHandler(requestMessage.method, requestMessage.params, cancellationSource.token);
                }
                const promise = handlerResult;
                if (!handlerResult) {
                    delete requestTokens[tokenKey];
                    replySuccess(handlerResult, requestMessage.method, startTime);
                }
                else if (promise.then) {
                    promise.then((resultOrError) => {
                        delete requestTokens[tokenKey];
                        reply(resultOrError, requestMessage.method, startTime);
                    }, error => {
                        delete requestTokens[tokenKey];
                        if (error instanceof messages.ResponseError) {
                            replyError(error, requestMessage.method, startTime);
                        }
                        else if (error && is$1.string(error.message)) {
                            replyError(new messages.ResponseError(messages.ErrorCodes.InternalError, `Request ${requestMessage.method} failed with message: ${error.message}`), requestMessage.method, startTime);
                        }
                        else {
                            replyError(new messages.ResponseError(messages.ErrorCodes.InternalError, `Request ${requestMessage.method} failed unexpectedly without providing any details.`), requestMessage.method, startTime);
                        }
                    });
                }
                else {
                    delete requestTokens[tokenKey];
                    reply(handlerResult, requestMessage.method, startTime);
                }
            }
            catch (error) {
                delete requestTokens[tokenKey];
                if (error instanceof messages.ResponseError) {
                    reply(error, requestMessage.method, startTime);
                }
                else if (error && is$1.string(error.message)) {
                    replyError(new messages.ResponseError(messages.ErrorCodes.InternalError, `Request ${requestMessage.method} failed with message: ${error.message}`), requestMessage.method, startTime);
                }
                else {
                    replyError(new messages.ResponseError(messages.ErrorCodes.InternalError, `Request ${requestMessage.method} failed unexpectedly without providing any details.`), requestMessage.method, startTime);
                }
            }
        }
        else {
            replyError(new messages.ResponseError(messages.ErrorCodes.MethodNotFound, `Unhandled method ${requestMessage.method}`), requestMessage.method, startTime);
        }
    }
    function handleResponse(responseMessage) {
        if (isDisposed()) {
            // See handle request.
            return;
        }
        if (responseMessage.id === null) {
            if (responseMessage.error) {
                logger.error(`Received response message without id: Error is: \n${JSON.stringify(responseMessage.error, undefined, 4)}`);
            }
            else {
                logger.error(`Received response message without id. No further error information provided.`);
            }
        }
        else {
            const key = String(responseMessage.id);
            const responsePromise = responsePromises[key];
            traceReceivedResponse(responseMessage, responsePromise);
            if (responsePromise) {
                delete responsePromises[key];
                try {
                    if (responseMessage.error) {
                        const error = responseMessage.error;
                        responsePromise.reject(new messages.ResponseError(error.code, error.message, error.data));
                    }
                    else if (responseMessage.result !== undefined) {
                        responsePromise.resolve(responseMessage.result);
                    }
                    else {
                        throw new Error('Should never happen.');
                    }
                }
                catch (error) {
                    if (error.message) {
                        logger.error(`Response handler '${responsePromise.method}' failed with message: ${error.message}`);
                    }
                    else {
                        logger.error(`Response handler '${responsePromise.method}' failed unexpectedly.`);
                    }
                }
            }
        }
    }
    function handleNotification(message) {
        if (isDisposed()) {
            // See handle request.
            return;
        }
        let type = undefined;
        let notificationHandler;
        if (message.method === CancelNotification.type.method) {
            notificationHandler = (params) => {
                const id = params.id;
                const source = requestTokens[String(id)];
                if (source) {
                    source.cancel();
                }
            };
        }
        else {
            const element = notificationHandlers[message.method];
            if (element) {
                notificationHandler = element.handler;
                type = element.type;
            }
        }
        if (notificationHandler || starNotificationHandler) {
            try {
                traceReceivedNotification(message);
                if (notificationHandler) {
                    if (message.params === undefined) {
                        if (type !== undefined) {
                            if (type.numberOfParams !== 0 && type.parameterStructures !== messages.ParameterStructures.byName) {
                                logger.error(`Notification ${message.method} defines ${type.numberOfParams} params but recevied none.`);
                            }
                        }
                        notificationHandler();
                    }
                    else if (Array.isArray(message.params)) {
                        if (type !== undefined) {
                            if (type.parameterStructures === messages.ParameterStructures.byName) {
                                logger.error(`Notification ${message.method} defines parameters by name but received parameters by position`);
                            }
                            if (type.numberOfParams !== message.params.length) {
                                logger.error(`Notification ${message.method} defines ${type.numberOfParams} params but received ${message.params.length} argumennts`);
                            }
                        }
                        notificationHandler(...message.params);
                    }
                    else {
                        if (type !== undefined && type.parameterStructures === messages.ParameterStructures.byPosition) {
                            logger.error(`Notification ${message.method} defines parameters by position but received parameters by name`);
                        }
                        notificationHandler(message.params);
                    }
                }
                else if (starNotificationHandler) {
                    starNotificationHandler(message.method, message.params);
                }
            }
            catch (error) {
                if (error.message) {
                    logger.error(`Notification handler '${message.method}' failed with message: ${error.message}`);
                }
                else {
                    logger.error(`Notification handler '${message.method}' failed unexpectedly.`);
                }
            }
        }
        else {
            unhandledNotificationEmitter.fire(message);
        }
    }
    function handleInvalidMessage(message) {
        if (!message) {
            logger.error('Received empty message.');
            return;
        }
        logger.error(`Received message which is neither a response nor a notification message:\n${JSON.stringify(message, null, 4)}`);
        // Test whether we find an id to reject the promise
        const responseMessage = message;
        if (is$1.string(responseMessage.id) || is$1.number(responseMessage.id)) {
            const key = String(responseMessage.id);
            const responseHandler = responsePromises[key];
            if (responseHandler) {
                responseHandler.reject(new Error('The received response has neither a result nor an error property.'));
            }
        }
    }
    function traceSendingRequest(message) {
        if (trace === Trace.Off || !tracer) {
            return;
        }
        if (traceFormat === TraceFormat.Text) {
            let data = undefined;
            if (trace === Trace.Verbose && message.params) {
                data = `Params: ${JSON.stringify(message.params, null, 4)}\n\n`;
            }
            tracer.log(`Sending request '${message.method} - (${message.id})'.`, data);
        }
        else {
            logLSPMessage('send-request', message);
        }
    }
    function traceSendingNotification(message) {
        if (trace === Trace.Off || !tracer) {
            return;
        }
        if (traceFormat === TraceFormat.Text) {
            let data = undefined;
            if (trace === Trace.Verbose) {
                if (message.params) {
                    data = `Params: ${JSON.stringify(message.params, null, 4)}\n\n`;
                }
                else {
                    data = 'No parameters provided.\n\n';
                }
            }
            tracer.log(`Sending notification '${message.method}'.`, data);
        }
        else {
            logLSPMessage('send-notification', message);
        }
    }
    function traceSendingResponse(message, method, startTime) {
        if (trace === Trace.Off || !tracer) {
            return;
        }
        if (traceFormat === TraceFormat.Text) {
            let data = undefined;
            if (trace === Trace.Verbose) {
                if (message.error && message.error.data) {
                    data = `Error data: ${JSON.stringify(message.error.data, null, 4)}\n\n`;
                }
                else {
                    if (message.result) {
                        data = `Result: ${JSON.stringify(message.result, null, 4)}\n\n`;
                    }
                    else if (message.error === undefined) {
                        data = 'No result returned.\n\n';
                    }
                }
            }
            tracer.log(`Sending response '${method} - (${message.id})'. Processing request took ${Date.now() - startTime}ms`, data);
        }
        else {
            logLSPMessage('send-response', message);
        }
    }
    function traceReceivedRequest(message) {
        if (trace === Trace.Off || !tracer) {
            return;
        }
        if (traceFormat === TraceFormat.Text) {
            let data = undefined;
            if (trace === Trace.Verbose && message.params) {
                data = `Params: ${JSON.stringify(message.params, null, 4)}\n\n`;
            }
            tracer.log(`Received request '${message.method} - (${message.id})'.`, data);
        }
        else {
            logLSPMessage('receive-request', message);
        }
    }
    function traceReceivedNotification(message) {
        if (trace === Trace.Off || !tracer || message.method === LogTraceNotification.type.method) {
            return;
        }
        if (traceFormat === TraceFormat.Text) {
            let data = undefined;
            if (trace === Trace.Verbose) {
                if (message.params) {
                    data = `Params: ${JSON.stringify(message.params, null, 4)}\n\n`;
                }
                else {
                    data = 'No parameters provided.\n\n';
                }
            }
            tracer.log(`Received notification '${message.method}'.`, data);
        }
        else {
            logLSPMessage('receive-notification', message);
        }
    }
    function traceReceivedResponse(message, responsePromise) {
        if (trace === Trace.Off || !tracer) {
            return;
        }
        if (traceFormat === TraceFormat.Text) {
            let data = undefined;
            if (trace === Trace.Verbose) {
                if (message.error && message.error.data) {
                    data = `Error data: ${JSON.stringify(message.error.data, null, 4)}\n\n`;
                }
                else {
                    if (message.result) {
                        data = `Result: ${JSON.stringify(message.result, null, 4)}\n\n`;
                    }
                    else if (message.error === undefined) {
                        data = 'No result returned.\n\n';
                    }
                }
            }
            if (responsePromise) {
                const error = message.error ? ` Request failed: ${message.error.message} (${message.error.code}).` : '';
                tracer.log(`Received response '${responsePromise.method} - (${message.id})' in ${Date.now() - responsePromise.timerStart}ms.${error}`, data);
            }
            else {
                tracer.log(`Received response ${message.id} without active response promise.`, data);
            }
        }
        else {
            logLSPMessage('receive-response', message);
        }
    }
    function logLSPMessage(type, message) {
        if (!tracer || trace === Trace.Off) {
            return;
        }
        const lspMessage = {
            isLSPMessage: true,
            type,
            message,
            timestamp: Date.now()
        };
        tracer.log(lspMessage);
    }
    function throwIfClosedOrDisposed() {
        if (isClosed()) {
            throw new ConnectionError(ConnectionErrors.Closed, 'Connection is closed.');
        }
        if (isDisposed()) {
            throw new ConnectionError(ConnectionErrors.Disposed, 'Connection is disposed.');
        }
    }
    function throwIfListening() {
        if (isListening()) {
            throw new ConnectionError(ConnectionErrors.AlreadyListening, 'Connection is already listening');
        }
    }
    function throwIfNotListening() {
        if (!isListening()) {
            throw new Error('Call listen() first.');
        }
    }
    function undefinedToNull(param) {
        if (param === undefined) {
            return null;
        }
        else {
            return param;
        }
    }
    function nullToUndefined(param) {
        if (param === null) {
            return undefined;
        }
        else {
            return param;
        }
    }
    function isNamedParam(param) {
        return param !== undefined && param !== null && !Array.isArray(param) && typeof param === 'object';
    }
    function computeSingleParam(parameterStructures, param) {
        switch (parameterStructures) {
            case messages.ParameterStructures.auto:
                if (isNamedParam(param)) {
                    return nullToUndefined(param);
                }
                else {
                    return [undefinedToNull(param)];
                }
            case messages.ParameterStructures.byName:
                if (!isNamedParam(param)) {
                    throw new Error(`Recevied parameters by name but param is not an object literal.`);
                }
                return nullToUndefined(param);
            case messages.ParameterStructures.byPosition:
                return [undefinedToNull(param)];
            default:
                throw new Error(`Unknown parameter structure ${parameterStructures.toString()}`);
        }
    }
    function computeMessageParams(type, params) {
        let result;
        const numberOfParams = type.numberOfParams;
        switch (numberOfParams) {
            case 0:
                result = undefined;
                break;
            case 1:
                result = computeSingleParam(type.parameterStructures, params[0]);
                break;
            default:
                result = [];
                for (let i = 0; i < params.length && i < numberOfParams; i++) {
                    result.push(undefinedToNull(params[i]));
                }
                if (params.length < numberOfParams) {
                    for (let i = params.length; i < numberOfParams; i++) {
                        result.push(null);
                    }
                }
                break;
        }
        return result;
    }
    const connection = {
        sendNotification: (type, ...args) => {
            throwIfClosedOrDisposed();
            let method;
            let messageParams;
            if (is$1.string(type)) {
                method = type;
                const first = args[0];
                let paramStart = 0;
                let parameterStructures = messages.ParameterStructures.auto;
                if (messages.ParameterStructures.is(first)) {
                    paramStart = 1;
                    parameterStructures = first;
                }
                let paramEnd = args.length;
                const numberOfParams = paramEnd - paramStart;
                switch (numberOfParams) {
                    case 0:
                        messageParams = undefined;
                        break;
                    case 1:
                        messageParams = computeSingleParam(parameterStructures, args[paramStart]);
                        break;
                    default:
                        if (parameterStructures === messages.ParameterStructures.byName) {
                            throw new Error(`Recevied ${numberOfParams} parameters for 'by Name' notification parameter structure.`);
                        }
                        messageParams = args.slice(paramStart, paramEnd).map(value => undefinedToNull(value));
                        break;
                }
            }
            else {
                const params = args;
                method = type.method;
                messageParams = computeMessageParams(type, params);
            }
            const notificationMessage = {
                jsonrpc: version,
                method: method,
                params: messageParams
            };
            traceSendingNotification(notificationMessage);
            messageWriter.write(notificationMessage);
        },
        onNotification: (type, handler) => {
            throwIfClosedOrDisposed();
            let method;
            if (is$1.func(type)) {
                starNotificationHandler = type;
            }
            else if (handler) {
                if (is$1.string(type)) {
                    method = type;
                    notificationHandlers[type] = { type: undefined, handler };
                }
                else {
                    method = type.method;
                    notificationHandlers[type.method] = { type, handler };
                }
            }
            return {
                dispose: () => {
                    if (method !== undefined) {
                        delete notificationHandlers[method];
                    }
                    else {
                        starNotificationHandler = undefined;
                    }
                }
            };
        },
        onProgress: (_type, token, handler) => {
            if (progressHandlers.has(token)) {
                throw new Error(`Progress handler for token ${token} already registered`);
            }
            progressHandlers.set(token, handler);
            return {
                dispose: () => {
                    progressHandlers.delete(token);
                }
            };
        },
        sendProgress: (_type, token, value) => {
            connection.sendNotification(ProgressNotification.type, { token, value });
        },
        onUnhandledProgress: unhandledProgressEmitter.event,
        sendRequest: (type, ...args) => {
            throwIfClosedOrDisposed();
            throwIfNotListening();
            let method;
            let messageParams;
            let token = undefined;
            if (is$1.string(type)) {
                method = type;
                const first = args[0];
                const last = args[args.length - 1];
                let paramStart = 0;
                let parameterStructures = messages.ParameterStructures.auto;
                if (messages.ParameterStructures.is(first)) {
                    paramStart = 1;
                    parameterStructures = first;
                }
                let paramEnd = args.length;
                if (cancellation.CancellationToken.is(last)) {
                    paramEnd = paramEnd - 1;
                    token = last;
                }
                const numberOfParams = paramEnd - paramStart;
                switch (numberOfParams) {
                    case 0:
                        messageParams = undefined;
                        break;
                    case 1:
                        messageParams = computeSingleParam(parameterStructures, args[paramStart]);
                        break;
                    default:
                        if (parameterStructures === messages.ParameterStructures.byName) {
                            throw new Error(`Recevied ${numberOfParams} parameters for 'by Name' request parameter structure.`);
                        }
                        messageParams = args.slice(paramStart, paramEnd).map(value => undefinedToNull(value));
                        break;
                }
            }
            else {
                const params = args;
                method = type.method;
                messageParams = computeMessageParams(type, params);
                const numberOfParams = type.numberOfParams;
                token = cancellation.CancellationToken.is(params[numberOfParams]) ? params[numberOfParams] : undefined;
            }
            const id = sequenceNumber++;
            let disposable;
            if (token) {
                disposable = token.onCancellationRequested(() => {
                    cancellationStrategy.sender.sendCancellation(connection, id);
                });
            }
            const result = new Promise((resolve, reject) => {
                const requestMessage = {
                    jsonrpc: version,
                    id: id,
                    method: method,
                    params: messageParams
                };
                const resolveWithCleanup = (r) => {
                    resolve(r);
                    cancellationStrategy.sender.cleanup(id);
                    disposable === null || disposable === void 0 ? void 0 : disposable.dispose();
                };
                const rejectWithCleanup = (r) => {
                    reject(r);
                    cancellationStrategy.sender.cleanup(id);
                    disposable === null || disposable === void 0 ? void 0 : disposable.dispose();
                };
                let responsePromise = { method: method, timerStart: Date.now(), resolve: resolveWithCleanup, reject: rejectWithCleanup };
                traceSendingRequest(requestMessage);
                try {
                    messageWriter.write(requestMessage);
                }
                catch (e) {
                    // Writing the message failed. So we need to reject the promise.
                    responsePromise.reject(new messages.ResponseError(messages.ErrorCodes.MessageWriteError, e.message ? e.message : 'Unknown reason'));
                    responsePromise = null;
                }
                if (responsePromise) {
                    responsePromises[String(id)] = responsePromise;
                }
            });
            return result;
        },
        onRequest: (type, handler) => {
            throwIfClosedOrDisposed();
            let method = null;
            if (StarRequestHandler.is(type)) {
                method = undefined;
                starRequestHandler = type;
            }
            else if (is$1.string(type)) {
                method = null;
                if (handler !== undefined) {
                    method = type;
                    requestHandlers[type] = { handler: handler, type: undefined };
                }
            }
            else {
                if (handler !== undefined) {
                    method = type.method;
                    requestHandlers[type.method] = { type, handler };
                }
            }
            return {
                dispose: () => {
                    if (method === null) {
                        return;
                    }
                    if (method !== undefined) {
                        delete requestHandlers[method];
                    }
                    else {
                        starRequestHandler = undefined;
                    }
                }
            };
        },
        trace: (_value, _tracer, sendNotificationOrTraceOptions) => {
            let _sendNotification = false;
            let _traceFormat = TraceFormat.Text;
            if (sendNotificationOrTraceOptions !== undefined) {
                if (is$1.boolean(sendNotificationOrTraceOptions)) {
                    _sendNotification = sendNotificationOrTraceOptions;
                }
                else {
                    _sendNotification = sendNotificationOrTraceOptions.sendNotification || false;
                    _traceFormat = sendNotificationOrTraceOptions.traceFormat || TraceFormat.Text;
                }
            }
            trace = _value;
            traceFormat = _traceFormat;
            if (trace === Trace.Off) {
                tracer = undefined;
            }
            else {
                tracer = _tracer;
            }
            if (_sendNotification && !isClosed() && !isDisposed()) {
                connection.sendNotification(SetTraceNotification.type, { value: Trace.toString(_value) });
            }
        },
        onError: errorEmitter.event,
        onClose: closeEmitter.event,
        onUnhandledNotification: unhandledNotificationEmitter.event,
        onDispose: disposeEmitter.event,
        end: () => {
            messageWriter.end();
        },
        dispose: () => {
            if (isDisposed()) {
                return;
            }
            state = ConnectionState.Disposed;
            disposeEmitter.fire(undefined);
            const error = new Error('Connection got disposed.');
            Object.keys(responsePromises).forEach((key) => {
                responsePromises[key].reject(error);
            });
            responsePromises = Object.create(null);
            requestTokens = Object.create(null);
            messageQueue = new linkedMap.LinkedMap();
            // Test for backwards compatibility
            if (is$1.func(messageWriter.dispose)) {
                messageWriter.dispose();
            }
            if (is$1.func(messageReader.dispose)) {
                messageReader.dispose();
            }
        },
        listen: () => {
            throwIfClosedOrDisposed();
            throwIfListening();
            state = ConnectionState.Listening;
            messageReader.listen(callback);
        },
        inspect: () => {
            // eslint-disable-next-line no-console
            ral.default().console.log('inspect');
        }
    };
    connection.onNotification(LogTraceNotification.type, (params) => {
        if (trace === Trace.Off || !tracer) {
            return;
        }
        tracer.log(params.message, trace === Trace.Verbose ? params.verbose : undefined);
    });
    connection.onNotification(ProgressNotification.type, (params) => {
        const handler = progressHandlers.get(params.token);
        if (handler) {
            handler(params.value);
        }
        else {
            unhandledProgressEmitter.fire(params);
        }
    });
    return connection;
}
exports.createMessageConnection = createMessageConnection;

});

var api = createCommonjsModule(function (module, exports) {
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
/// <reference path="../../typings/thenable.d.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
exports.CancellationSenderStrategy = exports.CancellationReceiverStrategy = exports.ConnectionError = exports.ConnectionErrors = exports.LogTraceNotification = exports.SetTraceNotification = exports.TraceFormat = exports.Trace = exports.ProgressType = exports.createMessageConnection = exports.NullLogger = exports.ConnectionOptions = exports.ConnectionStrategy = exports.WriteableStreamMessageWriter = exports.AbstractMessageWriter = exports.MessageWriter = exports.ReadableStreamMessageReader = exports.AbstractMessageReader = exports.MessageReader = exports.CancellationToken = exports.CancellationTokenSource = exports.Emitter = exports.Event = exports.Disposable = exports.ParameterStructures = exports.NotificationType9 = exports.NotificationType8 = exports.NotificationType7 = exports.NotificationType6 = exports.NotificationType5 = exports.NotificationType4 = exports.NotificationType3 = exports.NotificationType2 = exports.NotificationType1 = exports.NotificationType0 = exports.NotificationType = exports.ErrorCodes = exports.ResponseError = exports.RequestType9 = exports.RequestType8 = exports.RequestType7 = exports.RequestType6 = exports.RequestType5 = exports.RequestType4 = exports.RequestType3 = exports.RequestType2 = exports.RequestType1 = exports.RequestType0 = exports.RequestType = exports.RAL = void 0;
exports.CancellationStrategy = void 0;

Object.defineProperty(exports, "RequestType", { enumerable: true, get: function () { return messages.RequestType; } });
Object.defineProperty(exports, "RequestType0", { enumerable: true, get: function () { return messages.RequestType0; } });
Object.defineProperty(exports, "RequestType1", { enumerable: true, get: function () { return messages.RequestType1; } });
Object.defineProperty(exports, "RequestType2", { enumerable: true, get: function () { return messages.RequestType2; } });
Object.defineProperty(exports, "RequestType3", { enumerable: true, get: function () { return messages.RequestType3; } });
Object.defineProperty(exports, "RequestType4", { enumerable: true, get: function () { return messages.RequestType4; } });
Object.defineProperty(exports, "RequestType5", { enumerable: true, get: function () { return messages.RequestType5; } });
Object.defineProperty(exports, "RequestType6", { enumerable: true, get: function () { return messages.RequestType6; } });
Object.defineProperty(exports, "RequestType7", { enumerable: true, get: function () { return messages.RequestType7; } });
Object.defineProperty(exports, "RequestType8", { enumerable: true, get: function () { return messages.RequestType8; } });
Object.defineProperty(exports, "RequestType9", { enumerable: true, get: function () { return messages.RequestType9; } });
Object.defineProperty(exports, "ResponseError", { enumerable: true, get: function () { return messages.ResponseError; } });
Object.defineProperty(exports, "ErrorCodes", { enumerable: true, get: function () { return messages.ErrorCodes; } });
Object.defineProperty(exports, "NotificationType", { enumerable: true, get: function () { return messages.NotificationType; } });
Object.defineProperty(exports, "NotificationType0", { enumerable: true, get: function () { return messages.NotificationType0; } });
Object.defineProperty(exports, "NotificationType1", { enumerable: true, get: function () { return messages.NotificationType1; } });
Object.defineProperty(exports, "NotificationType2", { enumerable: true, get: function () { return messages.NotificationType2; } });
Object.defineProperty(exports, "NotificationType3", { enumerable: true, get: function () { return messages.NotificationType3; } });
Object.defineProperty(exports, "NotificationType4", { enumerable: true, get: function () { return messages.NotificationType4; } });
Object.defineProperty(exports, "NotificationType5", { enumerable: true, get: function () { return messages.NotificationType5; } });
Object.defineProperty(exports, "NotificationType6", { enumerable: true, get: function () { return messages.NotificationType6; } });
Object.defineProperty(exports, "NotificationType7", { enumerable: true, get: function () { return messages.NotificationType7; } });
Object.defineProperty(exports, "NotificationType8", { enumerable: true, get: function () { return messages.NotificationType8; } });
Object.defineProperty(exports, "NotificationType9", { enumerable: true, get: function () { return messages.NotificationType9; } });
Object.defineProperty(exports, "ParameterStructures", { enumerable: true, get: function () { return messages.ParameterStructures; } });

Object.defineProperty(exports, "Disposable", { enumerable: true, get: function () { return disposable.Disposable; } });

Object.defineProperty(exports, "Event", { enumerable: true, get: function () { return events.Event; } });
Object.defineProperty(exports, "Emitter", { enumerable: true, get: function () { return events.Emitter; } });

Object.defineProperty(exports, "CancellationTokenSource", { enumerable: true, get: function () { return cancellation.CancellationTokenSource; } });
Object.defineProperty(exports, "CancellationToken", { enumerable: true, get: function () { return cancellation.CancellationToken; } });

Object.defineProperty(exports, "MessageReader", { enumerable: true, get: function () { return messageReader.MessageReader; } });
Object.defineProperty(exports, "AbstractMessageReader", { enumerable: true, get: function () { return messageReader.AbstractMessageReader; } });
Object.defineProperty(exports, "ReadableStreamMessageReader", { enumerable: true, get: function () { return messageReader.ReadableStreamMessageReader; } });

Object.defineProperty(exports, "MessageWriter", { enumerable: true, get: function () { return messageWriter.MessageWriter; } });
Object.defineProperty(exports, "AbstractMessageWriter", { enumerable: true, get: function () { return messageWriter.AbstractMessageWriter; } });
Object.defineProperty(exports, "WriteableStreamMessageWriter", { enumerable: true, get: function () { return messageWriter.WriteableStreamMessageWriter; } });

Object.defineProperty(exports, "ConnectionStrategy", { enumerable: true, get: function () { return connection.ConnectionStrategy; } });
Object.defineProperty(exports, "ConnectionOptions", { enumerable: true, get: function () { return connection.ConnectionOptions; } });
Object.defineProperty(exports, "NullLogger", { enumerable: true, get: function () { return connection.NullLogger; } });
Object.defineProperty(exports, "createMessageConnection", { enumerable: true, get: function () { return connection.createMessageConnection; } });
Object.defineProperty(exports, "ProgressType", { enumerable: true, get: function () { return connection.ProgressType; } });
Object.defineProperty(exports, "Trace", { enumerable: true, get: function () { return connection.Trace; } });
Object.defineProperty(exports, "TraceFormat", { enumerable: true, get: function () { return connection.TraceFormat; } });
Object.defineProperty(exports, "SetTraceNotification", { enumerable: true, get: function () { return connection.SetTraceNotification; } });
Object.defineProperty(exports, "LogTraceNotification", { enumerable: true, get: function () { return connection.LogTraceNotification; } });
Object.defineProperty(exports, "ConnectionErrors", { enumerable: true, get: function () { return connection.ConnectionErrors; } });
Object.defineProperty(exports, "ConnectionError", { enumerable: true, get: function () { return connection.ConnectionError; } });
Object.defineProperty(exports, "CancellationReceiverStrategy", { enumerable: true, get: function () { return connection.CancellationReceiverStrategy; } });
Object.defineProperty(exports, "CancellationSenderStrategy", { enumerable: true, get: function () { return connection.CancellationSenderStrategy; } });
Object.defineProperty(exports, "CancellationStrategy", { enumerable: true, get: function () { return connection.CancellationStrategy; } });

exports.RAL = ral.default;

});

var main = createCommonjsModule(function (module, exports) {
var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (commonjsGlobal && commonjsGlobal.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMessageConnection = exports.createServerSocketTransport = exports.createClientSocketTransport = exports.createServerPipeTransport = exports.createClientPipeTransport = exports.generateRandomPipeName = exports.StreamMessageWriter = exports.StreamMessageReader = exports.SocketMessageWriter = exports.SocketMessageReader = exports.IPCMessageWriter = exports.IPCMessageReader = void 0;
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ----------------------------------------------------------------------------------------- */

// Install the node runtime abstract.
ril.default.install();





__exportStar(api, exports);
class IPCMessageReader extends api.AbstractMessageReader {
    constructor(process) {
        super();
        this.process = process;
        let eventEmitter = this.process;
        eventEmitter.on('error', (error) => this.fireError(error));
        eventEmitter.on('close', () => this.fireClose());
    }
    listen(callback) {
        this.process.on('message', callback);
        return api.Disposable.create(() => this.process.off('message', callback));
    }
}
exports.IPCMessageReader = IPCMessageReader;
class IPCMessageWriter extends api.AbstractMessageWriter {
    constructor(process) {
        super();
        this.process = process;
        this.errorCount = 0;
        let eventEmitter = this.process;
        eventEmitter.on('error', (error) => this.fireError(error));
        eventEmitter.on('close', () => this.fireClose);
    }
    write(msg) {
        try {
            if (typeof this.process.send === 'function') {
                this.process.send(msg, undefined, undefined, (error) => {
                    if (error) {
                        this.errorCount++;
                        this.handleError(error, msg);
                    }
                    else {
                        this.errorCount = 0;
                    }
                });
            }
            return Promise.resolve();
        }
        catch (error) {
            this.handleError(error, msg);
            return Promise.reject(error);
        }
    }
    handleError(error, msg) {
        this.errorCount++;
        this.fireError(error, msg, this.errorCount);
    }
    end() {
    }
}
exports.IPCMessageWriter = IPCMessageWriter;
class SocketMessageReader extends api.ReadableStreamMessageReader {
    constructor(socket, encoding = 'utf-8') {
        super(ril.default().stream.asReadableStream(socket), encoding);
    }
}
exports.SocketMessageReader = SocketMessageReader;
class SocketMessageWriter extends api.WriteableStreamMessageWriter {
    constructor(socket, options) {
        super(ril.default().stream.asWritableStream(socket), options);
        this.socket = socket;
    }
    dispose() {
        super.dispose();
        this.socket.destroy();
    }
}
exports.SocketMessageWriter = SocketMessageWriter;
class StreamMessageReader extends api.ReadableStreamMessageReader {
    constructor(readble, encoding) {
        super(ril.default().stream.asReadableStream(readble), encoding);
    }
}
exports.StreamMessageReader = StreamMessageReader;
class StreamMessageWriter extends api.WriteableStreamMessageWriter {
    constructor(writable, options) {
        super(ril.default().stream.asWritableStream(writable), options);
    }
}
exports.StreamMessageWriter = StreamMessageWriter;
const XDG_RUNTIME_DIR = process.env['XDG_RUNTIME_DIR'];
const safeIpcPathLengths = new Map([
    ['linux', 107],
    ['darwin', 103]
]);
function generateRandomPipeName() {
    const randomSuffix = crypto_1__default['default'].randomBytes(21).toString('hex');
    if (process.platform === 'win32') {
        return `\\\\.\\pipe\\vscode-jsonrpc-${randomSuffix}-sock`;
    }
    let result;
    if (XDG_RUNTIME_DIR) {
        result = path__default['default'].join(XDG_RUNTIME_DIR, `vscode-ipc-${randomSuffix}.sock`);
    }
    else {
        result = path__default['default'].join(os__default['default'].tmpdir(), `vscode-${randomSuffix}.sock`);
    }
    const limit = safeIpcPathLengths.get(process.platform);
    if (limit !== undefined && result.length >= limit) {
        ril.default().console.warn(`WARNING: IPC handle "${result}" is longer than ${limit} characters.`);
    }
    return result;
}
exports.generateRandomPipeName = generateRandomPipeName;
function createClientPipeTransport(pipeName, encoding = 'utf-8') {
    let connectResolve;
    const connected = new Promise((resolve, _reject) => {
        connectResolve = resolve;
    });
    return new Promise((resolve, reject) => {
        let server = net_1__default['default'].createServer((socket) => {
            server.close();
            connectResolve([
                new SocketMessageReader(socket, encoding),
                new SocketMessageWriter(socket, encoding)
            ]);
        });
        server.on('error', reject);
        server.listen(pipeName, () => {
            server.removeListener('error', reject);
            resolve({
                onConnected: () => { return connected; }
            });
        });
    });
}
exports.createClientPipeTransport = createClientPipeTransport;
function createServerPipeTransport(pipeName, encoding = 'utf-8') {
    const socket = net_1__default['default'].createConnection(pipeName);
    return [
        new SocketMessageReader(socket, encoding),
        new SocketMessageWriter(socket, encoding)
    ];
}
exports.createServerPipeTransport = createServerPipeTransport;
function createClientSocketTransport(port, encoding = 'utf-8') {
    let connectResolve;
    const connected = new Promise((resolve, _reject) => {
        connectResolve = resolve;
    });
    return new Promise((resolve, reject) => {
        const server = net_1__default['default'].createServer((socket) => {
            server.close();
            connectResolve([
                new SocketMessageReader(socket, encoding),
                new SocketMessageWriter(socket, encoding)
            ]);
        });
        server.on('error', reject);
        server.listen(port, '127.0.0.1', () => {
            server.removeListener('error', reject);
            resolve({
                onConnected: () => { return connected; }
            });
        });
    });
}
exports.createClientSocketTransport = createClientSocketTransport;
function createServerSocketTransport(port, encoding = 'utf-8') {
    const socket = net_1__default['default'].createConnection(port, '127.0.0.1');
    return [
        new SocketMessageReader(socket, encoding),
        new SocketMessageWriter(socket, encoding)
    ];
}
exports.createServerSocketTransport = createServerSocketTransport;
function isReadableStream(value) {
    const candidate = value;
    return candidate.read !== undefined && candidate.addListener !== undefined;
}
function isWritableStream(value) {
    const candidate = value;
    return candidate.write !== undefined && candidate.addListener !== undefined;
}
function createMessageConnection(input, output, logger, options) {
    if (!logger) {
        logger = api.NullLogger;
    }
    const reader = isReadableStream(input) ? new StreamMessageReader(input) : input;
    const writer = isWritableStream(output) ? new StreamMessageWriter(output) : output;
    if (api.ConnectionStrategy.is(options)) {
        options = { connectionStrategy: options };
    }
    return api.createMessageConnection(reader, writer, logger, options);
}
exports.createMessageConnection = createMessageConnection;

});

/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ----------------------------------------------------------------------------------------- */

var node = main;

/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
var integer;
(function (integer) {
    integer.MIN_VALUE = -2147483648;
    integer.MAX_VALUE = 2147483647;
})(integer || (integer = {}));
var uinteger;
(function (uinteger) {
    uinteger.MIN_VALUE = 0;
    uinteger.MAX_VALUE = 2147483647;
})(uinteger || (uinteger = {}));
/**
 * The Position namespace provides helper functions to work with
 * [Position](#Position) literals.
 */
var Position;
(function (Position) {
    /**
     * Creates a new Position literal from the given line and character.
     * @param line The position's line.
     * @param character The position's character.
     */
    function create(line, character) {
        if (line === Number.MAX_VALUE) {
            line = uinteger.MAX_VALUE;
        }
        if (character === Number.MAX_VALUE) {
            character = uinteger.MAX_VALUE;
        }
        return { line: line, character: character };
    }
    Position.create = create;
    /**
     * Checks whether the given literal conforms to the [Position](#Position) interface.
     */
    function is(value) {
        var candidate = value;
        return Is.objectLiteral(candidate) && Is.uinteger(candidate.line) && Is.uinteger(candidate.character);
    }
    Position.is = is;
})(Position || (Position = {}));
/**
 * The Range namespace provides helper functions to work with
 * [Range](#Range) literals.
 */
var Range$1;
(function (Range) {
    function create(one, two, three, four) {
        if (Is.uinteger(one) && Is.uinteger(two) && Is.uinteger(three) && Is.uinteger(four)) {
            return { start: Position.create(one, two), end: Position.create(three, four) };
        }
        else if (Position.is(one) && Position.is(two)) {
            return { start: one, end: two };
        }
        else {
            throw new Error("Range#create called with invalid arguments[" + one + ", " + two + ", " + three + ", " + four + "]");
        }
    }
    Range.create = create;
    /**
     * Checks whether the given literal conforms to the [Range](#Range) interface.
     */
    function is(value) {
        var candidate = value;
        return Is.objectLiteral(candidate) && Position.is(candidate.start) && Position.is(candidate.end);
    }
    Range.is = is;
})(Range$1 || (Range$1 = {}));
/**
 * The Location namespace provides helper functions to work with
 * [Location](#Location) literals.
 */
var Location;
(function (Location) {
    /**
     * Creates a Location literal.
     * @param uri The location's uri.
     * @param range The location's range.
     */
    function create(uri, range) {
        return { uri: uri, range: range };
    }
    Location.create = create;
    /**
     * Checks whether the given literal conforms to the [Location](#Location) interface.
     */
    function is(value) {
        var candidate = value;
        return Is.defined(candidate) && Range$1.is(candidate.range) && (Is.string(candidate.uri) || Is.undefined(candidate.uri));
    }
    Location.is = is;
})(Location || (Location = {}));
/**
 * The LocationLink namespace provides helper functions to work with
 * [LocationLink](#LocationLink) literals.
 */
var LocationLink;
(function (LocationLink) {
    /**
     * Creates a LocationLink literal.
     * @param targetUri The definition's uri.
     * @param targetRange The full range of the definition.
     * @param targetSelectionRange The span of the symbol definition at the target.
     * @param originSelectionRange The span of the symbol being defined in the originating source file.
     */
    function create(targetUri, targetRange, targetSelectionRange, originSelectionRange) {
        return { targetUri: targetUri, targetRange: targetRange, targetSelectionRange: targetSelectionRange, originSelectionRange: originSelectionRange };
    }
    LocationLink.create = create;
    /**
     * Checks whether the given literal conforms to the [LocationLink](#LocationLink) interface.
     */
    function is(value) {
        var candidate = value;
        return Is.defined(candidate) && Range$1.is(candidate.targetRange) && Is.string(candidate.targetUri)
            && (Range$1.is(candidate.targetSelectionRange) || Is.undefined(candidate.targetSelectionRange))
            && (Range$1.is(candidate.originSelectionRange) || Is.undefined(candidate.originSelectionRange));
    }
    LocationLink.is = is;
})(LocationLink || (LocationLink = {}));
/**
 * The Color namespace provides helper functions to work with
 * [Color](#Color) literals.
 */
var Color;
(function (Color) {
    /**
     * Creates a new Color literal.
     */
    function create(red, green, blue, alpha) {
        return {
            red: red,
            green: green,
            blue: blue,
            alpha: alpha,
        };
    }
    Color.create = create;
    /**
     * Checks whether the given literal conforms to the [Color](#Color) interface.
     */
    function is(value) {
        var candidate = value;
        return Is.numberRange(candidate.red, 0, 1)
            && Is.numberRange(candidate.green, 0, 1)
            && Is.numberRange(candidate.blue, 0, 1)
            && Is.numberRange(candidate.alpha, 0, 1);
    }
    Color.is = is;
})(Color || (Color = {}));
/**
 * The ColorInformation namespace provides helper functions to work with
 * [ColorInformation](#ColorInformation) literals.
 */
var ColorInformation;
(function (ColorInformation) {
    /**
     * Creates a new ColorInformation literal.
     */
    function create(range, color) {
        return {
            range: range,
            color: color,
        };
    }
    ColorInformation.create = create;
    /**
     * Checks whether the given literal conforms to the [ColorInformation](#ColorInformation) interface.
     */
    function is(value) {
        var candidate = value;
        return Range$1.is(candidate.range) && Color.is(candidate.color);
    }
    ColorInformation.is = is;
})(ColorInformation || (ColorInformation = {}));
/**
 * The Color namespace provides helper functions to work with
 * [ColorPresentation](#ColorPresentation) literals.
 */
var ColorPresentation;
(function (ColorPresentation) {
    /**
     * Creates a new ColorInformation literal.
     */
    function create(label, textEdit, additionalTextEdits) {
        return {
            label: label,
            textEdit: textEdit,
            additionalTextEdits: additionalTextEdits,
        };
    }
    ColorPresentation.create = create;
    /**
     * Checks whether the given literal conforms to the [ColorInformation](#ColorInformation) interface.
     */
    function is(value) {
        var candidate = value;
        return Is.string(candidate.label)
            && (Is.undefined(candidate.textEdit) || TextEdit.is(candidate))
            && (Is.undefined(candidate.additionalTextEdits) || Is.typedArray(candidate.additionalTextEdits, TextEdit.is));
    }
    ColorPresentation.is = is;
})(ColorPresentation || (ColorPresentation = {}));
/**
 * Enum of known range kinds
 */
var FoldingRangeKind;
(function (FoldingRangeKind) {
    /**
     * Folding range for a comment
     */
    FoldingRangeKind["Comment"] = "comment";
    /**
     * Folding range for a imports or includes
     */
    FoldingRangeKind["Imports"] = "imports";
    /**
     * Folding range for a region (e.g. `#region`)
     */
    FoldingRangeKind["Region"] = "region";
})(FoldingRangeKind || (FoldingRangeKind = {}));
/**
 * The folding range namespace provides helper functions to work with
 * [FoldingRange](#FoldingRange) literals.
 */
var FoldingRange;
(function (FoldingRange) {
    /**
     * Creates a new FoldingRange literal.
     */
    function create(startLine, endLine, startCharacter, endCharacter, kind) {
        var result = {
            startLine: startLine,
            endLine: endLine
        };
        if (Is.defined(startCharacter)) {
            result.startCharacter = startCharacter;
        }
        if (Is.defined(endCharacter)) {
            result.endCharacter = endCharacter;
        }
        if (Is.defined(kind)) {
            result.kind = kind;
        }
        return result;
    }
    FoldingRange.create = create;
    /**
     * Checks whether the given literal conforms to the [FoldingRange](#FoldingRange) interface.
     */
    function is(value) {
        var candidate = value;
        return Is.uinteger(candidate.startLine) && Is.uinteger(candidate.startLine)
            && (Is.undefined(candidate.startCharacter) || Is.uinteger(candidate.startCharacter))
            && (Is.undefined(candidate.endCharacter) || Is.uinteger(candidate.endCharacter))
            && (Is.undefined(candidate.kind) || Is.string(candidate.kind));
    }
    FoldingRange.is = is;
})(FoldingRange || (FoldingRange = {}));
/**
 * The DiagnosticRelatedInformation namespace provides helper functions to work with
 * [DiagnosticRelatedInformation](#DiagnosticRelatedInformation) literals.
 */
var DiagnosticRelatedInformation;
(function (DiagnosticRelatedInformation) {
    /**
     * Creates a new DiagnosticRelatedInformation literal.
     */
    function create(location, message) {
        return {
            location: location,
            message: message
        };
    }
    DiagnosticRelatedInformation.create = create;
    /**
     * Checks whether the given literal conforms to the [DiagnosticRelatedInformation](#DiagnosticRelatedInformation) interface.
     */
    function is(value) {
        var candidate = value;
        return Is.defined(candidate) && Location.is(candidate.location) && Is.string(candidate.message);
    }
    DiagnosticRelatedInformation.is = is;
})(DiagnosticRelatedInformation || (DiagnosticRelatedInformation = {}));
/**
 * The diagnostic's severity.
 */
var DiagnosticSeverity;
(function (DiagnosticSeverity) {
    /**
     * Reports an error.
     */
    DiagnosticSeverity.Error = 1;
    /**
     * Reports a warning.
     */
    DiagnosticSeverity.Warning = 2;
    /**
     * Reports an information.
     */
    DiagnosticSeverity.Information = 3;
    /**
     * Reports a hint.
     */
    DiagnosticSeverity.Hint = 4;
})(DiagnosticSeverity || (DiagnosticSeverity = {}));
/**
 * The diagnostic tags.
 *
 * @since 3.15.0
 */
var DiagnosticTag;
(function (DiagnosticTag) {
    /**
     * Unused or unnecessary code.
     *
     * Clients are allowed to render diagnostics with this tag faded out instead of having
     * an error squiggle.
     */
    DiagnosticTag.Unnecessary = 1;
    /**
     * Deprecated or obsolete code.
     *
     * Clients are allowed to rendered diagnostics with this tag strike through.
     */
    DiagnosticTag.Deprecated = 2;
})(DiagnosticTag || (DiagnosticTag = {}));
/**
 * The CodeDescription namespace provides functions to deal with descriptions for diagnostic codes.
 *
 * @since 3.16.0
 */
var CodeDescription;
(function (CodeDescription) {
    function is(value) {
        var candidate = value;
        return candidate !== undefined && candidate !== null && Is.string(candidate.href);
    }
    CodeDescription.is = is;
})(CodeDescription || (CodeDescription = {}));
/**
 * The Diagnostic namespace provides helper functions to work with
 * [Diagnostic](#Diagnostic) literals.
 */
var Diagnostic;
(function (Diagnostic) {
    /**
     * Creates a new Diagnostic literal.
     */
    function create(range, message, severity, code, source, relatedInformation) {
        var result = { range: range, message: message };
        if (Is.defined(severity)) {
            result.severity = severity;
        }
        if (Is.defined(code)) {
            result.code = code;
        }
        if (Is.defined(source)) {
            result.source = source;
        }
        if (Is.defined(relatedInformation)) {
            result.relatedInformation = relatedInformation;
        }
        return result;
    }
    Diagnostic.create = create;
    /**
     * Checks whether the given literal conforms to the [Diagnostic](#Diagnostic) interface.
     */
    function is(value) {
        var _a;
        var candidate = value;
        return Is.defined(candidate)
            && Range$1.is(candidate.range)
            && Is.string(candidate.message)
            && (Is.number(candidate.severity) || Is.undefined(candidate.severity))
            && (Is.integer(candidate.code) || Is.string(candidate.code) || Is.undefined(candidate.code))
            && (Is.undefined(candidate.codeDescription) || (Is.string((_a = candidate.codeDescription) === null || _a === void 0 ? void 0 : _a.href)))
            && (Is.string(candidate.source) || Is.undefined(candidate.source))
            && (Is.undefined(candidate.relatedInformation) || Is.typedArray(candidate.relatedInformation, DiagnosticRelatedInformation.is));
    }
    Diagnostic.is = is;
})(Diagnostic || (Diagnostic = {}));
/**
 * The Command namespace provides helper functions to work with
 * [Command](#Command) literals.
 */
var Command;
(function (Command) {
    /**
     * Creates a new Command literal.
     */
    function create(title, command) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        var result = { title: title, command: command };
        if (Is.defined(args) && args.length > 0) {
            result.arguments = args;
        }
        return result;
    }
    Command.create = create;
    /**
     * Checks whether the given literal conforms to the [Command](#Command) interface.
     */
    function is(value) {
        var candidate = value;
        return Is.defined(candidate) && Is.string(candidate.title) && Is.string(candidate.command);
    }
    Command.is = is;
})(Command || (Command = {}));
/**
 * The TextEdit namespace provides helper function to create replace,
 * insert and delete edits more easily.
 */
var TextEdit;
(function (TextEdit) {
    /**
     * Creates a replace text edit.
     * @param range The range of text to be replaced.
     * @param newText The new text.
     */
    function replace(range, newText) {
        return { range: range, newText: newText };
    }
    TextEdit.replace = replace;
    /**
     * Creates a insert text edit.
     * @param position The position to insert the text at.
     * @param newText The text to be inserted.
     */
    function insert(position, newText) {
        return { range: { start: position, end: position }, newText: newText };
    }
    TextEdit.insert = insert;
    /**
     * Creates a delete text edit.
     * @param range The range of text to be deleted.
     */
    function del(range) {
        return { range: range, newText: '' };
    }
    TextEdit.del = del;
    function is(value) {
        var candidate = value;
        return Is.objectLiteral(candidate)
            && Is.string(candidate.newText)
            && Range$1.is(candidate.range);
    }
    TextEdit.is = is;
})(TextEdit || (TextEdit = {}));
var ChangeAnnotation;
(function (ChangeAnnotation) {
    function create(label, needsConfirmation, description) {
        var result = { label: label };
        if (needsConfirmation !== undefined) {
            result.needsConfirmation = needsConfirmation;
        }
        if (description !== undefined) {
            result.description = description;
        }
        return result;
    }
    ChangeAnnotation.create = create;
    function is(value) {
        var candidate = value;
        return candidate !== undefined && Is.objectLiteral(candidate) && Is.string(candidate.label) &&
            (Is.boolean(candidate.needsConfirmation) || candidate.needsConfirmation === undefined) &&
            (Is.string(candidate.description) || candidate.description === undefined);
    }
    ChangeAnnotation.is = is;
})(ChangeAnnotation || (ChangeAnnotation = {}));
var ChangeAnnotationIdentifier;
(function (ChangeAnnotationIdentifier) {
    function is(value) {
        var candidate = value;
        return typeof candidate === 'string';
    }
    ChangeAnnotationIdentifier.is = is;
})(ChangeAnnotationIdentifier || (ChangeAnnotationIdentifier = {}));
var AnnotatedTextEdit;
(function (AnnotatedTextEdit) {
    /**
     * Creates an annotated replace text edit.
     *
     * @param range The range of text to be replaced.
     * @param newText The new text.
     * @param annotation The annotation.
     */
    function replace(range, newText, annotation) {
        return { range: range, newText: newText, annotationId: annotation };
    }
    AnnotatedTextEdit.replace = replace;
    /**
     * Creates an annotated insert text edit.
     *
     * @param position The position to insert the text at.
     * @param newText The text to be inserted.
     * @param annotation The annotation.
     */
    function insert(position, newText, annotation) {
        return { range: { start: position, end: position }, newText: newText, annotationId: annotation };
    }
    AnnotatedTextEdit.insert = insert;
    /**
     * Creates an annotated delete text edit.
     *
     * @param range The range of text to be deleted.
     * @param annotation The annotation.
     */
    function del(range, annotation) {
        return { range: range, newText: '', annotationId: annotation };
    }
    AnnotatedTextEdit.del = del;
    function is(value) {
        var candidate = value;
        return TextEdit.is(candidate) && (ChangeAnnotation.is(candidate.annotationId) || ChangeAnnotationIdentifier.is(candidate.annotationId));
    }
    AnnotatedTextEdit.is = is;
})(AnnotatedTextEdit || (AnnotatedTextEdit = {}));
/**
 * The TextDocumentEdit namespace provides helper function to create
 * an edit that manipulates a text document.
 */
var TextDocumentEdit;
(function (TextDocumentEdit) {
    /**
     * Creates a new `TextDocumentEdit`
     */
    function create(textDocument, edits) {
        return { textDocument: textDocument, edits: edits };
    }
    TextDocumentEdit.create = create;
    function is(value) {
        var candidate = value;
        return Is.defined(candidate)
            && OptionalVersionedTextDocumentIdentifier.is(candidate.textDocument)
            && Array.isArray(candidate.edits);
    }
    TextDocumentEdit.is = is;
})(TextDocumentEdit || (TextDocumentEdit = {}));
var CreateFile;
(function (CreateFile) {
    function create(uri, options, annotation) {
        var result = {
            kind: 'create',
            uri: uri
        };
        if (options !== undefined && (options.overwrite !== undefined || options.ignoreIfExists !== undefined)) {
            result.options = options;
        }
        if (annotation !== undefined) {
            result.annotationId = annotation;
        }
        return result;
    }
    CreateFile.create = create;
    function is(value) {
        var candidate = value;
        return candidate && candidate.kind === 'create' && Is.string(candidate.uri) && (candidate.options === undefined ||
            ((candidate.options.overwrite === undefined || Is.boolean(candidate.options.overwrite)) && (candidate.options.ignoreIfExists === undefined || Is.boolean(candidate.options.ignoreIfExists)))) && (candidate.annotationId === undefined || ChangeAnnotationIdentifier.is(candidate.annotationId));
    }
    CreateFile.is = is;
})(CreateFile || (CreateFile = {}));
var RenameFile;
(function (RenameFile) {
    function create(oldUri, newUri, options, annotation) {
        var result = {
            kind: 'rename',
            oldUri: oldUri,
            newUri: newUri
        };
        if (options !== undefined && (options.overwrite !== undefined || options.ignoreIfExists !== undefined)) {
            result.options = options;
        }
        if (annotation !== undefined) {
            result.annotationId = annotation;
        }
        return result;
    }
    RenameFile.create = create;
    function is(value) {
        var candidate = value;
        return candidate && candidate.kind === 'rename' && Is.string(candidate.oldUri) && Is.string(candidate.newUri) && (candidate.options === undefined ||
            ((candidate.options.overwrite === undefined || Is.boolean(candidate.options.overwrite)) && (candidate.options.ignoreIfExists === undefined || Is.boolean(candidate.options.ignoreIfExists)))) && (candidate.annotationId === undefined || ChangeAnnotationIdentifier.is(candidate.annotationId));
    }
    RenameFile.is = is;
})(RenameFile || (RenameFile = {}));
var DeleteFile;
(function (DeleteFile) {
    function create(uri, options, annotation) {
        var result = {
            kind: 'delete',
            uri: uri
        };
        if (options !== undefined && (options.recursive !== undefined || options.ignoreIfNotExists !== undefined)) {
            result.options = options;
        }
        if (annotation !== undefined) {
            result.annotationId = annotation;
        }
        return result;
    }
    DeleteFile.create = create;
    function is(value) {
        var candidate = value;
        return candidate && candidate.kind === 'delete' && Is.string(candidate.uri) && (candidate.options === undefined ||
            ((candidate.options.recursive === undefined || Is.boolean(candidate.options.recursive)) && (candidate.options.ignoreIfNotExists === undefined || Is.boolean(candidate.options.ignoreIfNotExists)))) && (candidate.annotationId === undefined || ChangeAnnotationIdentifier.is(candidate.annotationId));
    }
    DeleteFile.is = is;
})(DeleteFile || (DeleteFile = {}));
var WorkspaceEdit;
(function (WorkspaceEdit) {
    function is(value) {
        var candidate = value;
        return candidate &&
            (candidate.changes !== undefined || candidate.documentChanges !== undefined) &&
            (candidate.documentChanges === undefined || candidate.documentChanges.every(function (change) {
                if (Is.string(change.kind)) {
                    return CreateFile.is(change) || RenameFile.is(change) || DeleteFile.is(change);
                }
                else {
                    return TextDocumentEdit.is(change);
                }
            }));
    }
    WorkspaceEdit.is = is;
})(WorkspaceEdit || (WorkspaceEdit = {}));
var TextEditChangeImpl = /** @class */ (function () {
    function TextEditChangeImpl(edits, changeAnnotations) {
        this.edits = edits;
        this.changeAnnotations = changeAnnotations;
    }
    TextEditChangeImpl.prototype.insert = function (position, newText, annotation) {
        var edit;
        var id;
        if (annotation === undefined) {
            edit = TextEdit.insert(position, newText);
        }
        else if (ChangeAnnotationIdentifier.is(annotation)) {
            id = annotation;
            edit = AnnotatedTextEdit.insert(position, newText, annotation);
        }
        else {
            this.assertChangeAnnotations(this.changeAnnotations);
            id = this.changeAnnotations.manage(annotation);
            edit = AnnotatedTextEdit.insert(position, newText, id);
        }
        this.edits.push(edit);
        if (id !== undefined) {
            return id;
        }
    };
    TextEditChangeImpl.prototype.replace = function (range, newText, annotation) {
        var edit;
        var id;
        if (annotation === undefined) {
            edit = TextEdit.replace(range, newText);
        }
        else if (ChangeAnnotationIdentifier.is(annotation)) {
            id = annotation;
            edit = AnnotatedTextEdit.replace(range, newText, annotation);
        }
        else {
            this.assertChangeAnnotations(this.changeAnnotations);
            id = this.changeAnnotations.manage(annotation);
            edit = AnnotatedTextEdit.replace(range, newText, id);
        }
        this.edits.push(edit);
        if (id !== undefined) {
            return id;
        }
    };
    TextEditChangeImpl.prototype.delete = function (range, annotation) {
        var edit;
        var id;
        if (annotation === undefined) {
            edit = TextEdit.del(range);
        }
        else if (ChangeAnnotationIdentifier.is(annotation)) {
            id = annotation;
            edit = AnnotatedTextEdit.del(range, annotation);
        }
        else {
            this.assertChangeAnnotations(this.changeAnnotations);
            id = this.changeAnnotations.manage(annotation);
            edit = AnnotatedTextEdit.del(range, id);
        }
        this.edits.push(edit);
        if (id !== undefined) {
            return id;
        }
    };
    TextEditChangeImpl.prototype.add = function (edit) {
        this.edits.push(edit);
    };
    TextEditChangeImpl.prototype.all = function () {
        return this.edits;
    };
    TextEditChangeImpl.prototype.clear = function () {
        this.edits.splice(0, this.edits.length);
    };
    TextEditChangeImpl.prototype.assertChangeAnnotations = function (value) {
        if (value === undefined) {
            throw new Error("Text edit change is not configured to manage change annotations.");
        }
    };
    return TextEditChangeImpl;
}());
/**
 * A helper class
 */
var ChangeAnnotations = /** @class */ (function () {
    function ChangeAnnotations(annotations) {
        this._annotations = annotations === undefined ? Object.create(null) : annotations;
        this._counter = 0;
        this._size = 0;
    }
    ChangeAnnotations.prototype.all = function () {
        return this._annotations;
    };
    Object.defineProperty(ChangeAnnotations.prototype, "size", {
        get: function () {
            return this._size;
        },
        enumerable: false,
        configurable: true
    });
    ChangeAnnotations.prototype.manage = function (idOrAnnotation, annotation) {
        var id;
        if (ChangeAnnotationIdentifier.is(idOrAnnotation)) {
            id = idOrAnnotation;
        }
        else {
            id = this.nextId();
            annotation = idOrAnnotation;
        }
        if (this._annotations[id] !== undefined) {
            throw new Error("Id " + id + " is already in use.");
        }
        if (annotation === undefined) {
            throw new Error("No annotation provided for id " + id);
        }
        this._annotations[id] = annotation;
        this._size++;
        return id;
    };
    ChangeAnnotations.prototype.nextId = function () {
        this._counter++;
        return this._counter.toString();
    };
    return ChangeAnnotations;
}());
/**
 * A workspace change helps constructing changes to a workspace.
 */
var WorkspaceChange = /** @class */ (function () {
    function WorkspaceChange(workspaceEdit) {
        var _this = this;
        this._textEditChanges = Object.create(null);
        if (workspaceEdit !== undefined) {
            this._workspaceEdit = workspaceEdit;
            if (workspaceEdit.documentChanges) {
                this._changeAnnotations = new ChangeAnnotations(workspaceEdit.changeAnnotations);
                workspaceEdit.changeAnnotations = this._changeAnnotations.all();
                workspaceEdit.documentChanges.forEach(function (change) {
                    if (TextDocumentEdit.is(change)) {
                        var textEditChange = new TextEditChangeImpl(change.edits, _this._changeAnnotations);
                        _this._textEditChanges[change.textDocument.uri] = textEditChange;
                    }
                });
            }
            else if (workspaceEdit.changes) {
                Object.keys(workspaceEdit.changes).forEach(function (key) {
                    var textEditChange = new TextEditChangeImpl(workspaceEdit.changes[key]);
                    _this._textEditChanges[key] = textEditChange;
                });
            }
        }
        else {
            this._workspaceEdit = {};
        }
    }
    Object.defineProperty(WorkspaceChange.prototype, "edit", {
        /**
         * Returns the underlying [WorkspaceEdit](#WorkspaceEdit) literal
         * use to be returned from a workspace edit operation like rename.
         */
        get: function () {
            this.initDocumentChanges();
            if (this._changeAnnotations !== undefined) {
                if (this._changeAnnotations.size === 0) {
                    this._workspaceEdit.changeAnnotations = undefined;
                }
                else {
                    this._workspaceEdit.changeAnnotations = this._changeAnnotations.all();
                }
            }
            return this._workspaceEdit;
        },
        enumerable: false,
        configurable: true
    });
    WorkspaceChange.prototype.getTextEditChange = function (key) {
        if (OptionalVersionedTextDocumentIdentifier.is(key)) {
            this.initDocumentChanges();
            if (this._workspaceEdit.documentChanges === undefined) {
                throw new Error('Workspace edit is not configured for document changes.');
            }
            var textDocument = { uri: key.uri, version: key.version };
            var result = this._textEditChanges[textDocument.uri];
            if (!result) {
                var edits = [];
                var textDocumentEdit = {
                    textDocument: textDocument,
                    edits: edits
                };
                this._workspaceEdit.documentChanges.push(textDocumentEdit);
                result = new TextEditChangeImpl(edits, this._changeAnnotations);
                this._textEditChanges[textDocument.uri] = result;
            }
            return result;
        }
        else {
            this.initChanges();
            if (this._workspaceEdit.changes === undefined) {
                throw new Error('Workspace edit is not configured for normal text edit changes.');
            }
            var result = this._textEditChanges[key];
            if (!result) {
                var edits = [];
                this._workspaceEdit.changes[key] = edits;
                result = new TextEditChangeImpl(edits);
                this._textEditChanges[key] = result;
            }
            return result;
        }
    };
    WorkspaceChange.prototype.initDocumentChanges = function () {
        if (this._workspaceEdit.documentChanges === undefined && this._workspaceEdit.changes === undefined) {
            this._changeAnnotations = new ChangeAnnotations();
            this._workspaceEdit.documentChanges = [];
            this._workspaceEdit.changeAnnotations = this._changeAnnotations.all();
        }
    };
    WorkspaceChange.prototype.initChanges = function () {
        if (this._workspaceEdit.documentChanges === undefined && this._workspaceEdit.changes === undefined) {
            this._workspaceEdit.changes = Object.create(null);
        }
    };
    WorkspaceChange.prototype.createFile = function (uri, optionsOrAnnotation, options) {
        this.initDocumentChanges();
        if (this._workspaceEdit.documentChanges === undefined) {
            throw new Error('Workspace edit is not configured for document changes.');
        }
        var annotation;
        if (ChangeAnnotation.is(optionsOrAnnotation) || ChangeAnnotationIdentifier.is(optionsOrAnnotation)) {
            annotation = optionsOrAnnotation;
        }
        else {
            options = optionsOrAnnotation;
        }
        var operation;
        var id;
        if (annotation === undefined) {
            operation = CreateFile.create(uri, options);
        }
        else {
            id = ChangeAnnotationIdentifier.is(annotation) ? annotation : this._changeAnnotations.manage(annotation);
            operation = CreateFile.create(uri, options, id);
        }
        this._workspaceEdit.documentChanges.push(operation);
        if (id !== undefined) {
            return id;
        }
    };
    WorkspaceChange.prototype.renameFile = function (oldUri, newUri, optionsOrAnnotation, options) {
        this.initDocumentChanges();
        if (this._workspaceEdit.documentChanges === undefined) {
            throw new Error('Workspace edit is not configured for document changes.');
        }
        var annotation;
        if (ChangeAnnotation.is(optionsOrAnnotation) || ChangeAnnotationIdentifier.is(optionsOrAnnotation)) {
            annotation = optionsOrAnnotation;
        }
        else {
            options = optionsOrAnnotation;
        }
        var operation;
        var id;
        if (annotation === undefined) {
            operation = RenameFile.create(oldUri, newUri, options);
        }
        else {
            id = ChangeAnnotationIdentifier.is(annotation) ? annotation : this._changeAnnotations.manage(annotation);
            operation = RenameFile.create(oldUri, newUri, options, id);
        }
        this._workspaceEdit.documentChanges.push(operation);
        if (id !== undefined) {
            return id;
        }
    };
    WorkspaceChange.prototype.deleteFile = function (uri, optionsOrAnnotation, options) {
        this.initDocumentChanges();
        if (this._workspaceEdit.documentChanges === undefined) {
            throw new Error('Workspace edit is not configured for document changes.');
        }
        var annotation;
        if (ChangeAnnotation.is(optionsOrAnnotation) || ChangeAnnotationIdentifier.is(optionsOrAnnotation)) {
            annotation = optionsOrAnnotation;
        }
        else {
            options = optionsOrAnnotation;
        }
        var operation;
        var id;
        if (annotation === undefined) {
            operation = DeleteFile.create(uri, options);
        }
        else {
            id = ChangeAnnotationIdentifier.is(annotation) ? annotation : this._changeAnnotations.manage(annotation);
            operation = DeleteFile.create(uri, options, id);
        }
        this._workspaceEdit.documentChanges.push(operation);
        if (id !== undefined) {
            return id;
        }
    };
    return WorkspaceChange;
}());
/**
 * The TextDocumentIdentifier namespace provides helper functions to work with
 * [TextDocumentIdentifier](#TextDocumentIdentifier) literals.
 */
var TextDocumentIdentifier;
(function (TextDocumentIdentifier) {
    /**
     * Creates a new TextDocumentIdentifier literal.
     * @param uri The document's uri.
     */
    function create(uri) {
        return { uri: uri };
    }
    TextDocumentIdentifier.create = create;
    /**
     * Checks whether the given literal conforms to the [TextDocumentIdentifier](#TextDocumentIdentifier) interface.
     */
    function is(value) {
        var candidate = value;
        return Is.defined(candidate) && Is.string(candidate.uri);
    }
    TextDocumentIdentifier.is = is;
})(TextDocumentIdentifier || (TextDocumentIdentifier = {}));
/**
 * The VersionedTextDocumentIdentifier namespace provides helper functions to work with
 * [VersionedTextDocumentIdentifier](#VersionedTextDocumentIdentifier) literals.
 */
var VersionedTextDocumentIdentifier;
(function (VersionedTextDocumentIdentifier) {
    /**
     * Creates a new VersionedTextDocumentIdentifier literal.
     * @param uri The document's uri.
     * @param uri The document's text.
     */
    function create(uri, version) {
        return { uri: uri, version: version };
    }
    VersionedTextDocumentIdentifier.create = create;
    /**
     * Checks whether the given literal conforms to the [VersionedTextDocumentIdentifier](#VersionedTextDocumentIdentifier) interface.
     */
    function is(value) {
        var candidate = value;
        return Is.defined(candidate) && Is.string(candidate.uri) && Is.integer(candidate.version);
    }
    VersionedTextDocumentIdentifier.is = is;
})(VersionedTextDocumentIdentifier || (VersionedTextDocumentIdentifier = {}));
/**
 * The OptionalVersionedTextDocumentIdentifier namespace provides helper functions to work with
 * [OptionalVersionedTextDocumentIdentifier](#OptionalVersionedTextDocumentIdentifier) literals.
 */
var OptionalVersionedTextDocumentIdentifier;
(function (OptionalVersionedTextDocumentIdentifier) {
    /**
     * Creates a new OptionalVersionedTextDocumentIdentifier literal.
     * @param uri The document's uri.
     * @param uri The document's text.
     */
    function create(uri, version) {
        return { uri: uri, version: version };
    }
    OptionalVersionedTextDocumentIdentifier.create = create;
    /**
     * Checks whether the given literal conforms to the [OptionalVersionedTextDocumentIdentifier](#OptionalVersionedTextDocumentIdentifier) interface.
     */
    function is(value) {
        var candidate = value;
        return Is.defined(candidate) && Is.string(candidate.uri) && (candidate.version === null || Is.integer(candidate.version));
    }
    OptionalVersionedTextDocumentIdentifier.is = is;
})(OptionalVersionedTextDocumentIdentifier || (OptionalVersionedTextDocumentIdentifier = {}));
/**
 * The TextDocumentItem namespace provides helper functions to work with
 * [TextDocumentItem](#TextDocumentItem) literals.
 */
var TextDocumentItem;
(function (TextDocumentItem) {
    /**
     * Creates a new TextDocumentItem literal.
     * @param uri The document's uri.
     * @param languageId The document's language identifier.
     * @param version The document's version number.
     * @param text The document's text.
     */
    function create(uri, languageId, version, text) {
        return { uri: uri, languageId: languageId, version: version, text: text };
    }
    TextDocumentItem.create = create;
    /**
     * Checks whether the given literal conforms to the [TextDocumentItem](#TextDocumentItem) interface.
     */
    function is(value) {
        var candidate = value;
        return Is.defined(candidate) && Is.string(candidate.uri) && Is.string(candidate.languageId) && Is.integer(candidate.version) && Is.string(candidate.text);
    }
    TextDocumentItem.is = is;
})(TextDocumentItem || (TextDocumentItem = {}));
/**
 * Describes the content type that a client supports in various
 * result literals like `Hover`, `ParameterInfo` or `CompletionItem`.
 *
 * Please note that `MarkupKinds` must not start with a `$`. This kinds
 * are reserved for internal usage.
 */
var MarkupKind;
(function (MarkupKind) {
    /**
     * Plain text is supported as a content format
     */
    MarkupKind.PlainText = 'plaintext';
    /**
     * Markdown is supported as a content format
     */
    MarkupKind.Markdown = 'markdown';
})(MarkupKind || (MarkupKind = {}));
(function (MarkupKind) {
    /**
     * Checks whether the given value is a value of the [MarkupKind](#MarkupKind) type.
     */
    function is(value) {
        var candidate = value;
        return candidate === MarkupKind.PlainText || candidate === MarkupKind.Markdown;
    }
    MarkupKind.is = is;
})(MarkupKind || (MarkupKind = {}));
var MarkupContent;
(function (MarkupContent) {
    /**
     * Checks whether the given value conforms to the [MarkupContent](#MarkupContent) interface.
     */
    function is(value) {
        var candidate = value;
        return Is.objectLiteral(value) && MarkupKind.is(candidate.kind) && Is.string(candidate.value);
    }
    MarkupContent.is = is;
})(MarkupContent || (MarkupContent = {}));
/**
 * The kind of a completion entry.
 */
var CompletionItemKind;
(function (CompletionItemKind) {
    CompletionItemKind.Text = 1;
    CompletionItemKind.Method = 2;
    CompletionItemKind.Function = 3;
    CompletionItemKind.Constructor = 4;
    CompletionItemKind.Field = 5;
    CompletionItemKind.Variable = 6;
    CompletionItemKind.Class = 7;
    CompletionItemKind.Interface = 8;
    CompletionItemKind.Module = 9;
    CompletionItemKind.Property = 10;
    CompletionItemKind.Unit = 11;
    CompletionItemKind.Value = 12;
    CompletionItemKind.Enum = 13;
    CompletionItemKind.Keyword = 14;
    CompletionItemKind.Snippet = 15;
    CompletionItemKind.Color = 16;
    CompletionItemKind.File = 17;
    CompletionItemKind.Reference = 18;
    CompletionItemKind.Folder = 19;
    CompletionItemKind.EnumMember = 20;
    CompletionItemKind.Constant = 21;
    CompletionItemKind.Struct = 22;
    CompletionItemKind.Event = 23;
    CompletionItemKind.Operator = 24;
    CompletionItemKind.TypeParameter = 25;
})(CompletionItemKind || (CompletionItemKind = {}));
/**
 * Defines whether the insert text in a completion item should be interpreted as
 * plain text or a snippet.
 */
var InsertTextFormat;
(function (InsertTextFormat) {
    /**
     * The primary text to be inserted is treated as a plain string.
     */
    InsertTextFormat.PlainText = 1;
    /**
     * The primary text to be inserted is treated as a snippet.
     *
     * A snippet can define tab stops and placeholders with `$1`, `$2`
     * and `${3:foo}`. `$0` defines the final tab stop, it defaults to
     * the end of the snippet. Placeholders with equal identifiers are linked,
     * that is typing in one will update others too.
     *
     * See also: https://microsoft.github.io/language-server-protocol/specifications/specification-current/#snippet_syntax
     */
    InsertTextFormat.Snippet = 2;
})(InsertTextFormat || (InsertTextFormat = {}));
/**
 * Completion item tags are extra annotations that tweak the rendering of a completion
 * item.
 *
 * @since 3.15.0
 */
var CompletionItemTag;
(function (CompletionItemTag) {
    /**
     * Render a completion as obsolete, usually using a strike-out.
     */
    CompletionItemTag.Deprecated = 1;
})(CompletionItemTag || (CompletionItemTag = {}));
/**
 * The InsertReplaceEdit namespace provides functions to deal with insert / replace edits.
 *
 * @since 3.16.0
 */
var InsertReplaceEdit;
(function (InsertReplaceEdit) {
    /**
     * Creates a new insert / replace edit
     */
    function create(newText, insert, replace) {
        return { newText: newText, insert: insert, replace: replace };
    }
    InsertReplaceEdit.create = create;
    /**
     * Checks whether the given literal conforms to the [InsertReplaceEdit](#InsertReplaceEdit) interface.
     */
    function is(value) {
        var candidate = value;
        return candidate && Is.string(candidate.newText) && Range$1.is(candidate.insert) && Range$1.is(candidate.replace);
    }
    InsertReplaceEdit.is = is;
})(InsertReplaceEdit || (InsertReplaceEdit = {}));
/**
 * How whitespace and indentation is handled during completion
 * item insertion.
 *
 * @since 3.16.0
 */
var InsertTextMode;
(function (InsertTextMode) {
    /**
     * The insertion or replace strings is taken as it is. If the
     * value is multi line the lines below the cursor will be
     * inserted using the indentation defined in the string value.
     * The client will not apply any kind of adjustments to the
     * string.
     */
    InsertTextMode.asIs = 1;
    /**
     * The editor adjusts leading whitespace of new lines so that
     * they match the indentation up to the cursor of the line for
     * which the item is accepted.
     *
     * Consider a line like this: <2tabs><cursor><3tabs>foo. Accepting a
     * multi line completion item is indented using 2 tabs and all
     * following lines inserted will be indented using 2 tabs as well.
     */
    InsertTextMode.adjustIndentation = 2;
})(InsertTextMode || (InsertTextMode = {}));
/**
 * The CompletionItem namespace provides functions to deal with
 * completion items.
 */
var CompletionItem;
(function (CompletionItem) {
    /**
     * Create a completion item and seed it with a label.
     * @param label The completion item's label
     */
    function create(label) {
        return { label: label };
    }
    CompletionItem.create = create;
})(CompletionItem || (CompletionItem = {}));
/**
 * The CompletionList namespace provides functions to deal with
 * completion lists.
 */
var CompletionList;
(function (CompletionList) {
    /**
     * Creates a new completion list.
     *
     * @param items The completion items.
     * @param isIncomplete The list is not complete.
     */
    function create(items, isIncomplete) {
        return { items: items ? items : [], isIncomplete: !!isIncomplete };
    }
    CompletionList.create = create;
})(CompletionList || (CompletionList = {}));
var MarkedString;
(function (MarkedString) {
    /**
     * Creates a marked string from plain text.
     *
     * @param plainText The plain text.
     */
    function fromPlainText(plainText) {
        return plainText.replace(/[\\`*_{}[\]()#+\-.!]/g, '\\$&'); // escape markdown syntax tokens: http://daringfireball.net/projects/markdown/syntax#backslash
    }
    MarkedString.fromPlainText = fromPlainText;
    /**
     * Checks whether the given value conforms to the [MarkedString](#MarkedString) type.
     */
    function is(value) {
        var candidate = value;
        return Is.string(candidate) || (Is.objectLiteral(candidate) && Is.string(candidate.language) && Is.string(candidate.value));
    }
    MarkedString.is = is;
})(MarkedString || (MarkedString = {}));
var Hover;
(function (Hover) {
    /**
     * Checks whether the given value conforms to the [Hover](#Hover) interface.
     */
    function is(value) {
        var candidate = value;
        return !!candidate && Is.objectLiteral(candidate) && (MarkupContent.is(candidate.contents) ||
            MarkedString.is(candidate.contents) ||
            Is.typedArray(candidate.contents, MarkedString.is)) && (value.range === undefined || Range$1.is(value.range));
    }
    Hover.is = is;
})(Hover || (Hover = {}));
/**
 * The ParameterInformation namespace provides helper functions to work with
 * [ParameterInformation](#ParameterInformation) literals.
 */
var ParameterInformation;
(function (ParameterInformation) {
    /**
     * Creates a new parameter information literal.
     *
     * @param label A label string.
     * @param documentation A doc string.
     */
    function create(label, documentation) {
        return documentation ? { label: label, documentation: documentation } : { label: label };
    }
    ParameterInformation.create = create;
})(ParameterInformation || (ParameterInformation = {}));
/**
 * The SignatureInformation namespace provides helper functions to work with
 * [SignatureInformation](#SignatureInformation) literals.
 */
var SignatureInformation;
(function (SignatureInformation) {
    function create(label, documentation) {
        var parameters = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            parameters[_i - 2] = arguments[_i];
        }
        var result = { label: label };
        if (Is.defined(documentation)) {
            result.documentation = documentation;
        }
        if (Is.defined(parameters)) {
            result.parameters = parameters;
        }
        else {
            result.parameters = [];
        }
        return result;
    }
    SignatureInformation.create = create;
})(SignatureInformation || (SignatureInformation = {}));
/**
 * A document highlight kind.
 */
var DocumentHighlightKind;
(function (DocumentHighlightKind) {
    /**
     * A textual occurrence.
     */
    DocumentHighlightKind.Text = 1;
    /**
     * Read-access of a symbol, like reading a variable.
     */
    DocumentHighlightKind.Read = 2;
    /**
     * Write-access of a symbol, like writing to a variable.
     */
    DocumentHighlightKind.Write = 3;
})(DocumentHighlightKind || (DocumentHighlightKind = {}));
/**
 * DocumentHighlight namespace to provide helper functions to work with
 * [DocumentHighlight](#DocumentHighlight) literals.
 */
var DocumentHighlight;
(function (DocumentHighlight) {
    /**
     * Create a DocumentHighlight object.
     * @param range The range the highlight applies to.
     */
    function create(range, kind) {
        var result = { range: range };
        if (Is.number(kind)) {
            result.kind = kind;
        }
        return result;
    }
    DocumentHighlight.create = create;
})(DocumentHighlight || (DocumentHighlight = {}));
/**
 * A symbol kind.
 */
var SymbolKind;
(function (SymbolKind) {
    SymbolKind.File = 1;
    SymbolKind.Module = 2;
    SymbolKind.Namespace = 3;
    SymbolKind.Package = 4;
    SymbolKind.Class = 5;
    SymbolKind.Method = 6;
    SymbolKind.Property = 7;
    SymbolKind.Field = 8;
    SymbolKind.Constructor = 9;
    SymbolKind.Enum = 10;
    SymbolKind.Interface = 11;
    SymbolKind.Function = 12;
    SymbolKind.Variable = 13;
    SymbolKind.Constant = 14;
    SymbolKind.String = 15;
    SymbolKind.Number = 16;
    SymbolKind.Boolean = 17;
    SymbolKind.Array = 18;
    SymbolKind.Object = 19;
    SymbolKind.Key = 20;
    SymbolKind.Null = 21;
    SymbolKind.EnumMember = 22;
    SymbolKind.Struct = 23;
    SymbolKind.Event = 24;
    SymbolKind.Operator = 25;
    SymbolKind.TypeParameter = 26;
})(SymbolKind || (SymbolKind = {}));
/**
 * Symbol tags are extra annotations that tweak the rendering of a symbol.
 * @since 3.16
 */
var SymbolTag;
(function (SymbolTag) {
    /**
     * Render a symbol as obsolete, usually using a strike-out.
     */
    SymbolTag.Deprecated = 1;
})(SymbolTag || (SymbolTag = {}));
var SymbolInformation;
(function (SymbolInformation) {
    /**
     * Creates a new symbol information literal.
     *
     * @param name The name of the symbol.
     * @param kind The kind of the symbol.
     * @param range The range of the location of the symbol.
     * @param uri The resource of the location of symbol, defaults to the current document.
     * @param containerName The name of the symbol containing the symbol.
     */
    function create(name, kind, range, uri, containerName) {
        var result = {
            name: name,
            kind: kind,
            location: { uri: uri, range: range }
        };
        if (containerName) {
            result.containerName = containerName;
        }
        return result;
    }
    SymbolInformation.create = create;
})(SymbolInformation || (SymbolInformation = {}));
var DocumentSymbol;
(function (DocumentSymbol) {
    /**
     * Creates a new symbol information literal.
     *
     * @param name The name of the symbol.
     * @param detail The detail of the symbol.
     * @param kind The kind of the symbol.
     * @param range The range of the symbol.
     * @param selectionRange The selectionRange of the symbol.
     * @param children Children of the symbol.
     */
    function create(name, detail, kind, range, selectionRange, children) {
        var result = {
            name: name,
            detail: detail,
            kind: kind,
            range: range,
            selectionRange: selectionRange
        };
        if (children !== undefined) {
            result.children = children;
        }
        return result;
    }
    DocumentSymbol.create = create;
    /**
     * Checks whether the given literal conforms to the [DocumentSymbol](#DocumentSymbol) interface.
     */
    function is(value) {
        var candidate = value;
        return candidate &&
            Is.string(candidate.name) && Is.number(candidate.kind) &&
            Range$1.is(candidate.range) && Range$1.is(candidate.selectionRange) &&
            (candidate.detail === undefined || Is.string(candidate.detail)) &&
            (candidate.deprecated === undefined || Is.boolean(candidate.deprecated)) &&
            (candidate.children === undefined || Array.isArray(candidate.children)) &&
            (candidate.tags === undefined || Array.isArray(candidate.tags));
    }
    DocumentSymbol.is = is;
})(DocumentSymbol || (DocumentSymbol = {}));
/**
 * A set of predefined code action kinds
 */
var CodeActionKind;
(function (CodeActionKind) {
    /**
     * Empty kind.
     */
    CodeActionKind.Empty = '';
    /**
     * Base kind for quickfix actions: 'quickfix'
     */
    CodeActionKind.QuickFix = 'quickfix';
    /**
     * Base kind for refactoring actions: 'refactor'
     */
    CodeActionKind.Refactor = 'refactor';
    /**
     * Base kind for refactoring extraction actions: 'refactor.extract'
     *
     * Example extract actions:
     *
     * - Extract method
     * - Extract function
     * - Extract variable
     * - Extract interface from class
     * - ...
     */
    CodeActionKind.RefactorExtract = 'refactor.extract';
    /**
     * Base kind for refactoring inline actions: 'refactor.inline'
     *
     * Example inline actions:
     *
     * - Inline function
     * - Inline variable
     * - Inline constant
     * - ...
     */
    CodeActionKind.RefactorInline = 'refactor.inline';
    /**
     * Base kind for refactoring rewrite actions: 'refactor.rewrite'
     *
     * Example rewrite actions:
     *
     * - Convert JavaScript function to class
     * - Add or remove parameter
     * - Encapsulate field
     * - Make method static
     * - Move method to base class
     * - ...
     */
    CodeActionKind.RefactorRewrite = 'refactor.rewrite';
    /**
     * Base kind for source actions: `source`
     *
     * Source code actions apply to the entire file.
     */
    CodeActionKind.Source = 'source';
    /**
     * Base kind for an organize imports source action: `source.organizeImports`
     */
    CodeActionKind.SourceOrganizeImports = 'source.organizeImports';
    /**
     * Base kind for auto-fix source actions: `source.fixAll`.
     *
     * Fix all actions automatically fix errors that have a clear fix that do not require user input.
     * They should not suppress errors or perform unsafe fixes such as generating new types or classes.
     *
     * @since 3.15.0
     */
    CodeActionKind.SourceFixAll = 'source.fixAll';
})(CodeActionKind || (CodeActionKind = {}));
/**
 * The CodeActionContext namespace provides helper functions to work with
 * [CodeActionContext](#CodeActionContext) literals.
 */
var CodeActionContext;
(function (CodeActionContext) {
    /**
     * Creates a new CodeActionContext literal.
     */
    function create(diagnostics, only) {
        var result = { diagnostics: diagnostics };
        if (only !== undefined && only !== null) {
            result.only = only;
        }
        return result;
    }
    CodeActionContext.create = create;
    /**
     * Checks whether the given literal conforms to the [CodeActionContext](#CodeActionContext) interface.
     */
    function is(value) {
        var candidate = value;
        return Is.defined(candidate) && Is.typedArray(candidate.diagnostics, Diagnostic.is) && (candidate.only === undefined || Is.typedArray(candidate.only, Is.string));
    }
    CodeActionContext.is = is;
})(CodeActionContext || (CodeActionContext = {}));
var CodeAction;
(function (CodeAction) {
    function create(title, kindOrCommandOrEdit, kind) {
        var result = { title: title };
        var checkKind = true;
        if (typeof kindOrCommandOrEdit === 'string') {
            checkKind = false;
            result.kind = kindOrCommandOrEdit;
        }
        else if (Command.is(kindOrCommandOrEdit)) {
            result.command = kindOrCommandOrEdit;
        }
        else {
            result.edit = kindOrCommandOrEdit;
        }
        if (checkKind && kind !== undefined) {
            result.kind = kind;
        }
        return result;
    }
    CodeAction.create = create;
    function is(value) {
        var candidate = value;
        return candidate && Is.string(candidate.title) &&
            (candidate.diagnostics === undefined || Is.typedArray(candidate.diagnostics, Diagnostic.is)) &&
            (candidate.kind === undefined || Is.string(candidate.kind)) &&
            (candidate.edit !== undefined || candidate.command !== undefined) &&
            (candidate.command === undefined || Command.is(candidate.command)) &&
            (candidate.isPreferred === undefined || Is.boolean(candidate.isPreferred)) &&
            (candidate.edit === undefined || WorkspaceEdit.is(candidate.edit));
    }
    CodeAction.is = is;
})(CodeAction || (CodeAction = {}));
/**
 * The CodeLens namespace provides helper functions to work with
 * [CodeLens](#CodeLens) literals.
 */
var CodeLens;
(function (CodeLens) {
    /**
     * Creates a new CodeLens literal.
     */
    function create(range, data) {
        var result = { range: range };
        if (Is.defined(data)) {
            result.data = data;
        }
        return result;
    }
    CodeLens.create = create;
    /**
     * Checks whether the given literal conforms to the [CodeLens](#CodeLens) interface.
     */
    function is(value) {
        var candidate = value;
        return Is.defined(candidate) && Range$1.is(candidate.range) && (Is.undefined(candidate.command) || Command.is(candidate.command));
    }
    CodeLens.is = is;
})(CodeLens || (CodeLens = {}));
/**
 * The FormattingOptions namespace provides helper functions to work with
 * [FormattingOptions](#FormattingOptions) literals.
 */
var FormattingOptions;
(function (FormattingOptions) {
    /**
     * Creates a new FormattingOptions literal.
     */
    function create(tabSize, insertSpaces) {
        return { tabSize: tabSize, insertSpaces: insertSpaces };
    }
    FormattingOptions.create = create;
    /**
     * Checks whether the given literal conforms to the [FormattingOptions](#FormattingOptions) interface.
     */
    function is(value) {
        var candidate = value;
        return Is.defined(candidate) && Is.uinteger(candidate.tabSize) && Is.boolean(candidate.insertSpaces);
    }
    FormattingOptions.is = is;
})(FormattingOptions || (FormattingOptions = {}));
/**
 * The DocumentLink namespace provides helper functions to work with
 * [DocumentLink](#DocumentLink) literals.
 */
var DocumentLink;
(function (DocumentLink) {
    /**
     * Creates a new DocumentLink literal.
     */
    function create(range, target, data) {
        return { range: range, target: target, data: data };
    }
    DocumentLink.create = create;
    /**
     * Checks whether the given literal conforms to the [DocumentLink](#DocumentLink) interface.
     */
    function is(value) {
        var candidate = value;
        return Is.defined(candidate) && Range$1.is(candidate.range) && (Is.undefined(candidate.target) || Is.string(candidate.target));
    }
    DocumentLink.is = is;
})(DocumentLink || (DocumentLink = {}));
/**
 * The SelectionRange namespace provides helper function to work with
 * SelectionRange literals.
 */
var SelectionRange;
(function (SelectionRange) {
    /**
     * Creates a new SelectionRange
     * @param range the range.
     * @param parent an optional parent.
     */
    function create(range, parent) {
        return { range: range, parent: parent };
    }
    SelectionRange.create = create;
    function is(value) {
        var candidate = value;
        return candidate !== undefined && Range$1.is(candidate.range) && (candidate.parent === undefined || SelectionRange.is(candidate.parent));
    }
    SelectionRange.is = is;
})(SelectionRange || (SelectionRange = {}));
var EOL = ['\n', '\r\n', '\r'];
/**
 * @deprecated Use the text document from the new vscode-languageserver-textdocument package.
 */
var TextDocument;
(function (TextDocument) {
    /**
     * Creates a new ITextDocument literal from the given uri and content.
     * @param uri The document's uri.
     * @param languageId  The document's language Id.
     * @param content The document's content.
     */
    function create(uri, languageId, version, content) {
        return new FullTextDocument(uri, languageId, version, content);
    }
    TextDocument.create = create;
    /**
     * Checks whether the given literal conforms to the [ITextDocument](#ITextDocument) interface.
     */
    function is(value) {
        var candidate = value;
        return Is.defined(candidate) && Is.string(candidate.uri) && (Is.undefined(candidate.languageId) || Is.string(candidate.languageId)) && Is.uinteger(candidate.lineCount)
            && Is.func(candidate.getText) && Is.func(candidate.positionAt) && Is.func(candidate.offsetAt) ? true : false;
    }
    TextDocument.is = is;
    function applyEdits(document, edits) {
        var text = document.getText();
        var sortedEdits = mergeSort(edits, function (a, b) {
            var diff = a.range.start.line - b.range.start.line;
            if (diff === 0) {
                return a.range.start.character - b.range.start.character;
            }
            return diff;
        });
        var lastModifiedOffset = text.length;
        for (var i = sortedEdits.length - 1; i >= 0; i--) {
            var e = sortedEdits[i];
            var startOffset = document.offsetAt(e.range.start);
            var endOffset = document.offsetAt(e.range.end);
            if (endOffset <= lastModifiedOffset) {
                text = text.substring(0, startOffset) + e.newText + text.substring(endOffset, text.length);
            }
            else {
                throw new Error('Overlapping edit');
            }
            lastModifiedOffset = startOffset;
        }
        return text;
    }
    TextDocument.applyEdits = applyEdits;
    function mergeSort(data, compare) {
        if (data.length <= 1) {
            // sorted
            return data;
        }
        var p = (data.length / 2) | 0;
        var left = data.slice(0, p);
        var right = data.slice(p);
        mergeSort(left, compare);
        mergeSort(right, compare);
        var leftIdx = 0;
        var rightIdx = 0;
        var i = 0;
        while (leftIdx < left.length && rightIdx < right.length) {
            var ret = compare(left[leftIdx], right[rightIdx]);
            if (ret <= 0) {
                // smaller_equal -> take left to preserve order
                data[i++] = left[leftIdx++];
            }
            else {
                // greater -> take right
                data[i++] = right[rightIdx++];
            }
        }
        while (leftIdx < left.length) {
            data[i++] = left[leftIdx++];
        }
        while (rightIdx < right.length) {
            data[i++] = right[rightIdx++];
        }
        return data;
    }
})(TextDocument || (TextDocument = {}));
/**
 * @deprecated Use the text document from the new vscode-languageserver-textdocument package.
 */
var FullTextDocument = /** @class */ (function () {
    function FullTextDocument(uri, languageId, version, content) {
        this._uri = uri;
        this._languageId = languageId;
        this._version = version;
        this._content = content;
        this._lineOffsets = undefined;
    }
    Object.defineProperty(FullTextDocument.prototype, "uri", {
        get: function () {
            return this._uri;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FullTextDocument.prototype, "languageId", {
        get: function () {
            return this._languageId;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FullTextDocument.prototype, "version", {
        get: function () {
            return this._version;
        },
        enumerable: false,
        configurable: true
    });
    FullTextDocument.prototype.getText = function (range) {
        if (range) {
            var start = this.offsetAt(range.start);
            var end = this.offsetAt(range.end);
            return this._content.substring(start, end);
        }
        return this._content;
    };
    FullTextDocument.prototype.update = function (event, version) {
        this._content = event.text;
        this._version = version;
        this._lineOffsets = undefined;
    };
    FullTextDocument.prototype.getLineOffsets = function () {
        if (this._lineOffsets === undefined) {
            var lineOffsets = [];
            var text = this._content;
            var isLineStart = true;
            for (var i = 0; i < text.length; i++) {
                if (isLineStart) {
                    lineOffsets.push(i);
                    isLineStart = false;
                }
                var ch = text.charAt(i);
                isLineStart = (ch === '\r' || ch === '\n');
                if (ch === '\r' && i + 1 < text.length && text.charAt(i + 1) === '\n') {
                    i++;
                }
            }
            if (isLineStart && text.length > 0) {
                lineOffsets.push(text.length);
            }
            this._lineOffsets = lineOffsets;
        }
        return this._lineOffsets;
    };
    FullTextDocument.prototype.positionAt = function (offset) {
        offset = Math.max(Math.min(offset, this._content.length), 0);
        var lineOffsets = this.getLineOffsets();
        var low = 0, high = lineOffsets.length;
        if (high === 0) {
            return Position.create(0, offset);
        }
        while (low < high) {
            var mid = Math.floor((low + high) / 2);
            if (lineOffsets[mid] > offset) {
                high = mid;
            }
            else {
                low = mid + 1;
            }
        }
        // low is the least x for which the line offset is larger than the current offset
        // or array.length if no line offset is larger than the current offset
        var line = low - 1;
        return Position.create(line, offset - lineOffsets[line]);
    };
    FullTextDocument.prototype.offsetAt = function (position) {
        var lineOffsets = this.getLineOffsets();
        if (position.line >= lineOffsets.length) {
            return this._content.length;
        }
        else if (position.line < 0) {
            return 0;
        }
        var lineOffset = lineOffsets[position.line];
        var nextLineOffset = (position.line + 1 < lineOffsets.length) ? lineOffsets[position.line + 1] : this._content.length;
        return Math.max(Math.min(lineOffset + position.character, nextLineOffset), lineOffset);
    };
    Object.defineProperty(FullTextDocument.prototype, "lineCount", {
        get: function () {
            return this.getLineOffsets().length;
        },
        enumerable: false,
        configurable: true
    });
    return FullTextDocument;
}());
var Is;
(function (Is) {
    var toString = Object.prototype.toString;
    function defined(value) {
        return typeof value !== 'undefined';
    }
    Is.defined = defined;
    function undefined$1(value) {
        return typeof value === 'undefined';
    }
    Is.undefined = undefined$1;
    function boolean(value) {
        return value === true || value === false;
    }
    Is.boolean = boolean;
    function string(value) {
        return toString.call(value) === '[object String]';
    }
    Is.string = string;
    function number(value) {
        return toString.call(value) === '[object Number]';
    }
    Is.number = number;
    function numberRange(value, min, max) {
        return toString.call(value) === '[object Number]' && min <= value && value <= max;
    }
    Is.numberRange = numberRange;
    function integer(value) {
        return toString.call(value) === '[object Number]' && -2147483648 <= value && value <= 2147483647;
    }
    Is.integer = integer;
    function uinteger(value) {
        return toString.call(value) === '[object Number]' && 0 <= value && value <= 2147483647;
    }
    Is.uinteger = uinteger;
    function func(value) {
        return toString.call(value) === '[object Function]';
    }
    Is.func = func;
    function objectLiteral(value) {
        // Strictly speaking class instances pass this check as well. Since the LSP
        // doesn't use classes we ignore this for now. If we do we need to add something
        // like this: `Object.getPrototypeOf(Object.getPrototypeOf(x)) === null`
        return value !== null && typeof value === 'object';
    }
    Is.objectLiteral = objectLiteral;
    function typedArray(value, check) {
        return Array.isArray(value) && value.every(check);
    }
    Is.typedArray = typedArray;
})(Is || (Is = {}));

var main$1 = /*#__PURE__*/Object.freeze({
	__proto__: null,
	get integer () { return integer; },
	get uinteger () { return uinteger; },
	get Position () { return Position; },
	get Range () { return Range$1; },
	get Location () { return Location; },
	get LocationLink () { return LocationLink; },
	get Color () { return Color; },
	get ColorInformation () { return ColorInformation; },
	get ColorPresentation () { return ColorPresentation; },
	get FoldingRangeKind () { return FoldingRangeKind; },
	get FoldingRange () { return FoldingRange; },
	get DiagnosticRelatedInformation () { return DiagnosticRelatedInformation; },
	get DiagnosticSeverity () { return DiagnosticSeverity; },
	get DiagnosticTag () { return DiagnosticTag; },
	get CodeDescription () { return CodeDescription; },
	get Diagnostic () { return Diagnostic; },
	get Command () { return Command; },
	get TextEdit () { return TextEdit; },
	get ChangeAnnotation () { return ChangeAnnotation; },
	get ChangeAnnotationIdentifier () { return ChangeAnnotationIdentifier; },
	get AnnotatedTextEdit () { return AnnotatedTextEdit; },
	get TextDocumentEdit () { return TextDocumentEdit; },
	get CreateFile () { return CreateFile; },
	get RenameFile () { return RenameFile; },
	get DeleteFile () { return DeleteFile; },
	get WorkspaceEdit () { return WorkspaceEdit; },
	WorkspaceChange: WorkspaceChange,
	get TextDocumentIdentifier () { return TextDocumentIdentifier; },
	get VersionedTextDocumentIdentifier () { return VersionedTextDocumentIdentifier; },
	get OptionalVersionedTextDocumentIdentifier () { return OptionalVersionedTextDocumentIdentifier; },
	get TextDocumentItem () { return TextDocumentItem; },
	get MarkupKind () { return MarkupKind; },
	get MarkupContent () { return MarkupContent; },
	get CompletionItemKind () { return CompletionItemKind; },
	get InsertTextFormat () { return InsertTextFormat; },
	get CompletionItemTag () { return CompletionItemTag; },
	get InsertReplaceEdit () { return InsertReplaceEdit; },
	get InsertTextMode () { return InsertTextMode; },
	get CompletionItem () { return CompletionItem; },
	get CompletionList () { return CompletionList; },
	get MarkedString () { return MarkedString; },
	get Hover () { return Hover; },
	get ParameterInformation () { return ParameterInformation; },
	get SignatureInformation () { return SignatureInformation; },
	get DocumentHighlightKind () { return DocumentHighlightKind; },
	get DocumentHighlight () { return DocumentHighlight; },
	get SymbolKind () { return SymbolKind; },
	get SymbolTag () { return SymbolTag; },
	get SymbolInformation () { return SymbolInformation; },
	get DocumentSymbol () { return DocumentSymbol; },
	get CodeActionKind () { return CodeActionKind; },
	get CodeActionContext () { return CodeActionContext; },
	get CodeAction () { return CodeAction; },
	get CodeLens () { return CodeLens; },
	get FormattingOptions () { return FormattingOptions; },
	get DocumentLink () { return DocumentLink; },
	get SelectionRange () { return SelectionRange; },
	EOL: EOL,
	get TextDocument () { return TextDocument; }
});

var messages$1 = createCommonjsModule(function (module, exports) {
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProtocolNotificationType = exports.ProtocolNotificationType0 = exports.ProtocolRequestType = exports.ProtocolRequestType0 = exports.RegistrationType = void 0;

class RegistrationType {
    constructor(method) {
        this.method = method;
    }
}
exports.RegistrationType = RegistrationType;
class ProtocolRequestType0 extends main.RequestType0 {
    constructor(method) {
        super(method);
    }
}
exports.ProtocolRequestType0 = ProtocolRequestType0;
class ProtocolRequestType extends main.RequestType {
    constructor(method) {
        super(method, main.ParameterStructures.byName);
    }
}
exports.ProtocolRequestType = ProtocolRequestType;
class ProtocolNotificationType0 extends main.NotificationType0 {
    constructor(method) {
        super(method);
    }
}
exports.ProtocolNotificationType0 = ProtocolNotificationType0;
class ProtocolNotificationType extends main.NotificationType {
    constructor(method) {
        super(method, main.ParameterStructures.byName);
    }
}
exports.ProtocolNotificationType = ProtocolNotificationType;
// let x: ProtocolNotificationType<number, { value: number}>;
// let y: ProtocolNotificationType<string, { value: number}>;
// x = y;

});

/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

var is$2 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.objectLiteral = exports.typedArray = exports.stringArray = exports.array = exports.func = exports.error = exports.number = exports.string = exports.boolean = void 0;
function boolean(value) {
    return value === true || value === false;
}
exports.boolean = boolean;
function string(value) {
    return typeof value === 'string' || value instanceof String;
}
exports.string = string;
function number(value) {
    return typeof value === 'number' || value instanceof Number;
}
exports.number = number;
function error(value) {
    return value instanceof Error;
}
exports.error = error;
function func(value) {
    return typeof value === 'function';
}
exports.func = func;
function array(value) {
    return Array.isArray(value);
}
exports.array = array;
function stringArray(value) {
    return array(value) && value.every(elem => string(elem));
}
exports.stringArray = stringArray;
function typedArray(value, check) {
    return Array.isArray(value) && value.every(check);
}
exports.typedArray = typedArray;
function objectLiteral(value) {
    // Strictly speaking class instances pass this check as well. Since the LSP
    // doesn't use classes we ignore this for now. If we do we need to add something
    // like this: `Object.getPrototypeOf(Object.getPrototypeOf(x)) === null`
    return value !== null && typeof value === 'object';
}
exports.objectLiteral = objectLiteral;

});

var protocol_implementation = createCommonjsModule(function (module, exports) {
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImplementationRequest = void 0;
/**
 * A request to resolve the implementation locations of a symbol at a given text
 * document position. The request's parameter is of type [TextDocumentPositioParams]
 * (#TextDocumentPositionParams) the response is of type [Definition](#Definition) or a
 * Thenable that resolves to such.
 */
var ImplementationRequest;
(function (ImplementationRequest) {
    ImplementationRequest.method = 'textDocument/implementation';
    ImplementationRequest.type = new messages$1.ProtocolRequestType(ImplementationRequest.method);
})(ImplementationRequest = exports.ImplementationRequest || (exports.ImplementationRequest = {}));

});

var protocol_typeDefinition = createCommonjsModule(function (module, exports) {
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeDefinitionRequest = void 0;
/**
 * A request to resolve the type definition locations of a symbol at a given text
 * document position. The request's parameter is of type [TextDocumentPositioParams]
 * (#TextDocumentPositionParams) the response is of type [Definition](#Definition) or a
 * Thenable that resolves to such.
 */
var TypeDefinitionRequest;
(function (TypeDefinitionRequest) {
    TypeDefinitionRequest.method = 'textDocument/typeDefinition';
    TypeDefinitionRequest.type = new messages$1.ProtocolRequestType(TypeDefinitionRequest.method);
})(TypeDefinitionRequest = exports.TypeDefinitionRequest || (exports.TypeDefinitionRequest = {}));

});

var protocol_workspaceFolders = createCommonjsModule(function (module, exports) {
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DidChangeWorkspaceFoldersNotification = exports.WorkspaceFoldersRequest = void 0;

/**
 * The `workspace/workspaceFolders` is sent from the server to the client to fetch the open workspace folders.
 */
var WorkspaceFoldersRequest;
(function (WorkspaceFoldersRequest) {
    WorkspaceFoldersRequest.type = new messages$1.ProtocolRequestType0('workspace/workspaceFolders');
})(WorkspaceFoldersRequest = exports.WorkspaceFoldersRequest || (exports.WorkspaceFoldersRequest = {}));
/**
 * The `workspace/didChangeWorkspaceFolders` notification is sent from the client to the server when the workspace
 * folder configuration changes.
 */
var DidChangeWorkspaceFoldersNotification;
(function (DidChangeWorkspaceFoldersNotification) {
    DidChangeWorkspaceFoldersNotification.type = new messages$1.ProtocolNotificationType('workspace/didChangeWorkspaceFolders');
})(DidChangeWorkspaceFoldersNotification = exports.DidChangeWorkspaceFoldersNotification || (exports.DidChangeWorkspaceFoldersNotification = {}));

});

var protocol_configuration = createCommonjsModule(function (module, exports) {
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigurationRequest = void 0;

/**
 * The 'workspace/configuration' request is sent from the server to the client to fetch a certain
 * configuration setting.
 *
 * This pull model replaces the old push model were the client signaled configuration change via an
 * event. If the server still needs to react to configuration changes (since the server caches the
 * result of `workspace/configuration` requests) the server should register for an empty configuration
 * change event and empty the cache if such an event is received.
 */
var ConfigurationRequest;
(function (ConfigurationRequest) {
    ConfigurationRequest.type = new messages$1.ProtocolRequestType('workspace/configuration');
})(ConfigurationRequest = exports.ConfigurationRequest || (exports.ConfigurationRequest = {}));

});

var protocol_colorProvider = createCommonjsModule(function (module, exports) {
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColorPresentationRequest = exports.DocumentColorRequest = void 0;

/**
 * A request to list all color symbols found in a given text document. The request's
 * parameter is of type [DocumentColorParams](#DocumentColorParams) the
 * response is of type [ColorInformation[]](#ColorInformation) or a Thenable
 * that resolves to such.
 */
var DocumentColorRequest;
(function (DocumentColorRequest) {
    DocumentColorRequest.method = 'textDocument/documentColor';
    DocumentColorRequest.type = new messages$1.ProtocolRequestType(DocumentColorRequest.method);
})(DocumentColorRequest = exports.DocumentColorRequest || (exports.DocumentColorRequest = {}));
/**
 * A request to list all presentation for a color. The request's
 * parameter is of type [ColorPresentationParams](#ColorPresentationParams) the
 * response is of type [ColorInformation[]](#ColorInformation) or a Thenable
 * that resolves to such.
 */
var ColorPresentationRequest;
(function (ColorPresentationRequest) {
    ColorPresentationRequest.type = new messages$1.ProtocolRequestType('textDocument/colorPresentation');
})(ColorPresentationRequest = exports.ColorPresentationRequest || (exports.ColorPresentationRequest = {}));

});

var protocol_foldingRange = createCommonjsModule(function (module, exports) {
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.FoldingRangeRequest = exports.FoldingRangeKind = void 0;

/**
 * Enum of known range kinds
 */
var FoldingRangeKind;
(function (FoldingRangeKind) {
    /**
     * Folding range for a comment
     */
    FoldingRangeKind["Comment"] = "comment";
    /**
     * Folding range for a imports or includes
     */
    FoldingRangeKind["Imports"] = "imports";
    /**
     * Folding range for a region (e.g. `#region`)
     */
    FoldingRangeKind["Region"] = "region";
})(FoldingRangeKind = exports.FoldingRangeKind || (exports.FoldingRangeKind = {}));
/**
 * A request to provide folding ranges in a document. The request's
 * parameter is of type [FoldingRangeParams](#FoldingRangeParams), the
 * response is of type [FoldingRangeList](#FoldingRangeList) or a Thenable
 * that resolves to such.
 */
var FoldingRangeRequest;
(function (FoldingRangeRequest) {
    FoldingRangeRequest.method = 'textDocument/foldingRange';
    FoldingRangeRequest.type = new messages$1.ProtocolRequestType(FoldingRangeRequest.method);
})(FoldingRangeRequest = exports.FoldingRangeRequest || (exports.FoldingRangeRequest = {}));

});

var protocol_declaration = createCommonjsModule(function (module, exports) {
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeclarationRequest = void 0;
/**
 * A request to resolve the type definition locations of a symbol at a given text
 * document position. The request's parameter is of type [TextDocumentPositioParams]
 * (#TextDocumentPositionParams) the response is of type [Declaration](#Declaration)
 * or a typed array of [DeclarationLink](#DeclarationLink) or a Thenable that resolves
 * to such.
 */
var DeclarationRequest;
(function (DeclarationRequest) {
    DeclarationRequest.method = 'textDocument/declaration';
    DeclarationRequest.type = new messages$1.ProtocolRequestType(DeclarationRequest.method);
})(DeclarationRequest = exports.DeclarationRequest || (exports.DeclarationRequest = {}));

});

var protocol_selectionRange = createCommonjsModule(function (module, exports) {
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectionRangeRequest = void 0;

/**
 * A request to provide selection ranges in a document. The request's
 * parameter is of type [SelectionRangeParams](#SelectionRangeParams), the
 * response is of type [SelectionRange[]](#SelectionRange[]) or a Thenable
 * that resolves to such.
 */
var SelectionRangeRequest;
(function (SelectionRangeRequest) {
    SelectionRangeRequest.method = 'textDocument/selectionRange';
    SelectionRangeRequest.type = new messages$1.ProtocolRequestType(SelectionRangeRequest.method);
})(SelectionRangeRequest = exports.SelectionRangeRequest || (exports.SelectionRangeRequest = {}));

});

var protocol_progress = createCommonjsModule(function (module, exports) {
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkDoneProgressCancelNotification = exports.WorkDoneProgressCreateRequest = exports.WorkDoneProgress = void 0;


var WorkDoneProgress;
(function (WorkDoneProgress) {
    WorkDoneProgress.type = new main.ProgressType();
    function is(value) {
        return value === WorkDoneProgress.type;
    }
    WorkDoneProgress.is = is;
})(WorkDoneProgress = exports.WorkDoneProgress || (exports.WorkDoneProgress = {}));
/**
 * The `window/workDoneProgress/create` request is sent from the server to the client to initiate progress
 * reporting from the server.
 */
var WorkDoneProgressCreateRequest;
(function (WorkDoneProgressCreateRequest) {
    WorkDoneProgressCreateRequest.type = new messages$1.ProtocolRequestType('window/workDoneProgress/create');
})(WorkDoneProgressCreateRequest = exports.WorkDoneProgressCreateRequest || (exports.WorkDoneProgressCreateRequest = {}));
/**
 * The `window/workDoneProgress/cancel` notification is sent from  the client to the server to cancel a progress
 * initiated on the server side.
 */
var WorkDoneProgressCancelNotification;
(function (WorkDoneProgressCancelNotification) {
    WorkDoneProgressCancelNotification.type = new messages$1.ProtocolNotificationType('window/workDoneProgress/cancel');
})(WorkDoneProgressCancelNotification = exports.WorkDoneProgressCancelNotification || (exports.WorkDoneProgressCancelNotification = {}));

});

var protocol_callHierarchy = createCommonjsModule(function (module, exports) {
/* --------------------------------------------------------------------------------------------
 * Copyright (c) TypeFox and others. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CallHierarchyOutgoingCallsRequest = exports.CallHierarchyIncomingCallsRequest = exports.CallHierarchyPrepareRequest = void 0;

/**
 * A request to result a `CallHierarchyItem` in a document at a given position.
 * Can be used as an input to a incoming or outgoing call hierarchy.
 *
 * @since 3.16.0
 */
var CallHierarchyPrepareRequest;
(function (CallHierarchyPrepareRequest) {
    CallHierarchyPrepareRequest.method = 'textDocument/prepareCallHierarchy';
    CallHierarchyPrepareRequest.type = new messages$1.ProtocolRequestType(CallHierarchyPrepareRequest.method);
})(CallHierarchyPrepareRequest = exports.CallHierarchyPrepareRequest || (exports.CallHierarchyPrepareRequest = {}));
/**
 * A request to resolve the incoming calls for a given `CallHierarchyItem`.
 *
 * @since 3.16.0
 */
var CallHierarchyIncomingCallsRequest;
(function (CallHierarchyIncomingCallsRequest) {
    CallHierarchyIncomingCallsRequest.method = 'callHierarchy/incomingCalls';
    CallHierarchyIncomingCallsRequest.type = new messages$1.ProtocolRequestType(CallHierarchyIncomingCallsRequest.method);
})(CallHierarchyIncomingCallsRequest = exports.CallHierarchyIncomingCallsRequest || (exports.CallHierarchyIncomingCallsRequest = {}));
/**
 * A request to resolve the outgoing calls for a given `CallHierarchyItem`.
 *
 * @since 3.16.0
 */
var CallHierarchyOutgoingCallsRequest;
(function (CallHierarchyOutgoingCallsRequest) {
    CallHierarchyOutgoingCallsRequest.method = 'callHierarchy/outgoingCalls';
    CallHierarchyOutgoingCallsRequest.type = new messages$1.ProtocolRequestType(CallHierarchyOutgoingCallsRequest.method);
})(CallHierarchyOutgoingCallsRequest = exports.CallHierarchyOutgoingCallsRequest || (exports.CallHierarchyOutgoingCallsRequest = {}));

});

var protocol_semanticTokens = createCommonjsModule(function (module, exports) {
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SemanticTokensRefreshRequest = exports.SemanticTokensRangeRequest = exports.SemanticTokensDeltaRequest = exports.SemanticTokensRequest = exports.SemanticTokensRegistrationType = exports.TokenFormat = exports.SemanticTokens = exports.SemanticTokenModifiers = exports.SemanticTokenTypes = void 0;

/**
 * A set of predefined token types. This set is not fixed
 * an clients can specify additional token types via the
 * corresponding client capabilities.
 *
 * @since 3.16.0
 */
var SemanticTokenTypes;
(function (SemanticTokenTypes) {
    SemanticTokenTypes["namespace"] = "namespace";
    /**
     * Represents a generic type. Acts as a fallback for types which can't be mapped to
     * a specific type like class or enum.
     */
    SemanticTokenTypes["type"] = "type";
    SemanticTokenTypes["class"] = "class";
    SemanticTokenTypes["enum"] = "enum";
    SemanticTokenTypes["interface"] = "interface";
    SemanticTokenTypes["struct"] = "struct";
    SemanticTokenTypes["typeParameter"] = "typeParameter";
    SemanticTokenTypes["parameter"] = "parameter";
    SemanticTokenTypes["variable"] = "variable";
    SemanticTokenTypes["property"] = "property";
    SemanticTokenTypes["enumMember"] = "enumMember";
    SemanticTokenTypes["event"] = "event";
    SemanticTokenTypes["function"] = "function";
    SemanticTokenTypes["method"] = "method";
    SemanticTokenTypes["macro"] = "macro";
    SemanticTokenTypes["keyword"] = "keyword";
    SemanticTokenTypes["modifier"] = "modifier";
    SemanticTokenTypes["comment"] = "comment";
    SemanticTokenTypes["string"] = "string";
    SemanticTokenTypes["number"] = "number";
    SemanticTokenTypes["regexp"] = "regexp";
    SemanticTokenTypes["operator"] = "operator";
})(SemanticTokenTypes = exports.SemanticTokenTypes || (exports.SemanticTokenTypes = {}));
/**
 * A set of predefined token modifiers. This set is not fixed
 * an clients can specify additional token types via the
 * corresponding client capabilities.
 *
 * @since 3.16.0
 */
var SemanticTokenModifiers;
(function (SemanticTokenModifiers) {
    SemanticTokenModifiers["declaration"] = "declaration";
    SemanticTokenModifiers["definition"] = "definition";
    SemanticTokenModifiers["readonly"] = "readonly";
    SemanticTokenModifiers["static"] = "static";
    SemanticTokenModifiers["deprecated"] = "deprecated";
    SemanticTokenModifiers["abstract"] = "abstract";
    SemanticTokenModifiers["async"] = "async";
    SemanticTokenModifiers["modification"] = "modification";
    SemanticTokenModifiers["documentation"] = "documentation";
    SemanticTokenModifiers["defaultLibrary"] = "defaultLibrary";
})(SemanticTokenModifiers = exports.SemanticTokenModifiers || (exports.SemanticTokenModifiers = {}));
/**
 * @since 3.16.0
 */
var SemanticTokens;
(function (SemanticTokens) {
    function is(value) {
        const candidate = value;
        return candidate !== undefined && (candidate.resultId === undefined || typeof candidate.resultId === 'string') &&
            Array.isArray(candidate.data) && (candidate.data.length === 0 || typeof candidate.data[0] === 'number');
    }
    SemanticTokens.is = is;
})(SemanticTokens = exports.SemanticTokens || (exports.SemanticTokens = {}));
//------- 'textDocument/semanticTokens' -----
var TokenFormat;
(function (TokenFormat) {
    TokenFormat.Relative = 'relative';
})(TokenFormat = exports.TokenFormat || (exports.TokenFormat = {}));
var SemanticTokensRegistrationType;
(function (SemanticTokensRegistrationType) {
    SemanticTokensRegistrationType.method = 'textDocument/semanticTokens';
    SemanticTokensRegistrationType.type = new messages$1.RegistrationType(SemanticTokensRegistrationType.method);
})(SemanticTokensRegistrationType = exports.SemanticTokensRegistrationType || (exports.SemanticTokensRegistrationType = {}));
/**
 * @since 3.16.0
 */
var SemanticTokensRequest;
(function (SemanticTokensRequest) {
    SemanticTokensRequest.method = 'textDocument/semanticTokens/full';
    SemanticTokensRequest.type = new messages$1.ProtocolRequestType(SemanticTokensRequest.method);
})(SemanticTokensRequest = exports.SemanticTokensRequest || (exports.SemanticTokensRequest = {}));
/**
 * @since 3.16.0
 */
var SemanticTokensDeltaRequest;
(function (SemanticTokensDeltaRequest) {
    SemanticTokensDeltaRequest.method = 'textDocument/semanticTokens/full/delta';
    SemanticTokensDeltaRequest.type = new messages$1.ProtocolRequestType(SemanticTokensDeltaRequest.method);
})(SemanticTokensDeltaRequest = exports.SemanticTokensDeltaRequest || (exports.SemanticTokensDeltaRequest = {}));
/**
 * @since 3.16.0
 */
var SemanticTokensRangeRequest;
(function (SemanticTokensRangeRequest) {
    SemanticTokensRangeRequest.method = 'textDocument/semanticTokens/range';
    SemanticTokensRangeRequest.type = new messages$1.ProtocolRequestType(SemanticTokensRangeRequest.method);
})(SemanticTokensRangeRequest = exports.SemanticTokensRangeRequest || (exports.SemanticTokensRangeRequest = {}));
/**
 * @since 3.16.0
 */
var SemanticTokensRefreshRequest;
(function (SemanticTokensRefreshRequest) {
    SemanticTokensRefreshRequest.method = `workspace/semanticTokens/refresh`;
    SemanticTokensRefreshRequest.type = new messages$1.ProtocolRequestType0(SemanticTokensRefreshRequest.method);
})(SemanticTokensRefreshRequest = exports.SemanticTokensRefreshRequest || (exports.SemanticTokensRefreshRequest = {}));

});

var protocol_showDocument = createCommonjsModule(function (module, exports) {
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShowDocumentRequest = void 0;

/**
 * A request to show a document. This request might open an
 * external program depending on the value of the URI to open.
 * For example a request to open `https://code.visualstudio.com/`
 * will very likely open the URI in a WEB browser.
 *
 * @since 3.16.0
*/
var ShowDocumentRequest;
(function (ShowDocumentRequest) {
    ShowDocumentRequest.method = 'window/showDocument';
    ShowDocumentRequest.type = new messages$1.ProtocolRequestType(ShowDocumentRequest.method);
})(ShowDocumentRequest = exports.ShowDocumentRequest || (exports.ShowDocumentRequest = {}));

});

var protocol_linkedEditingRange = createCommonjsModule(function (module, exports) {
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinkedEditingRangeRequest = void 0;

/**
 * A request to provide ranges that can be edited together.
 *
 * @since 3.16.0
 */
var LinkedEditingRangeRequest;
(function (LinkedEditingRangeRequest) {
    LinkedEditingRangeRequest.method = 'textDocument/linkedEditingRange';
    LinkedEditingRangeRequest.type = new messages$1.ProtocolRequestType(LinkedEditingRangeRequest.method);
})(LinkedEditingRangeRequest = exports.LinkedEditingRangeRequest || (exports.LinkedEditingRangeRequest = {}));

});

var protocol_fileOperations = createCommonjsModule(function (module, exports) {
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
Object.defineProperty(exports, "__esModule", { value: true });
exports.WillDeleteFilesRequest = exports.DidDeleteFilesNotification = exports.DidRenameFilesNotification = exports.WillRenameFilesRequest = exports.DidCreateFilesNotification = exports.WillCreateFilesRequest = exports.FileOperationPatternKind = void 0;

/**
 * A pattern kind describing if a glob pattern matches a file a folder or
 * both.
 *
 * @since 3.16.0
 */
var FileOperationPatternKind;
(function (FileOperationPatternKind) {
    /**
     * The pattern matches a file only.
     */
    FileOperationPatternKind.file = 'file';
    /**
     * The pattern matches a folder only.
     */
    FileOperationPatternKind.folder = 'folder';
})(FileOperationPatternKind = exports.FileOperationPatternKind || (exports.FileOperationPatternKind = {}));
/**
 * The will create files request is sent from the client to the server before files are actually
 * created as long as the creation is triggered from within the client.
 *
 * @since 3.16.0
 */
var WillCreateFilesRequest;
(function (WillCreateFilesRequest) {
    WillCreateFilesRequest.method = 'workspace/willCreateFiles';
    WillCreateFilesRequest.type = new messages$1.ProtocolRequestType(WillCreateFilesRequest.method);
})(WillCreateFilesRequest = exports.WillCreateFilesRequest || (exports.WillCreateFilesRequest = {}));
/**
 * The did create files notification is sent from the client to the server when
 * files were created from within the client.
 *
 * @since 3.16.0
 */
var DidCreateFilesNotification;
(function (DidCreateFilesNotification) {
    DidCreateFilesNotification.method = 'workspace/didCreateFiles';
    DidCreateFilesNotification.type = new messages$1.ProtocolNotificationType(DidCreateFilesNotification.method);
})(DidCreateFilesNotification = exports.DidCreateFilesNotification || (exports.DidCreateFilesNotification = {}));
/**
 * The will rename files request is sent from the client to the server before files are actually
 * renamed as long as the rename is triggered from within the client.
 *
 * @since 3.16.0
 */
var WillRenameFilesRequest;
(function (WillRenameFilesRequest) {
    WillRenameFilesRequest.method = 'workspace/willRenameFiles';
    WillRenameFilesRequest.type = new messages$1.ProtocolRequestType(WillRenameFilesRequest.method);
})(WillRenameFilesRequest = exports.WillRenameFilesRequest || (exports.WillRenameFilesRequest = {}));
/**
 * The did rename files notification is sent from the client to the server when
 * files were renamed from within the client.
 *
 * @since 3.16.0
 */
var DidRenameFilesNotification;
(function (DidRenameFilesNotification) {
    DidRenameFilesNotification.method = 'workspace/didRenameFiles';
    DidRenameFilesNotification.type = new messages$1.ProtocolNotificationType(DidRenameFilesNotification.method);
})(DidRenameFilesNotification = exports.DidRenameFilesNotification || (exports.DidRenameFilesNotification = {}));
/**
 * The will delete files request is sent from the client to the server before files are actually
 * deleted as long as the deletion is triggered from within the client.
 *
 * @since 3.16.0
 */
var DidDeleteFilesNotification;
(function (DidDeleteFilesNotification) {
    DidDeleteFilesNotification.method = 'workspace/didDeleteFiles';
    DidDeleteFilesNotification.type = new messages$1.ProtocolNotificationType(DidDeleteFilesNotification.method);
})(DidDeleteFilesNotification = exports.DidDeleteFilesNotification || (exports.DidDeleteFilesNotification = {}));
/**
 * The did delete files notification is sent from the client to the server when
 * files were deleted from within the client.
 *
 * @since 3.16.0
 */
var WillDeleteFilesRequest;
(function (WillDeleteFilesRequest) {
    WillDeleteFilesRequest.method = 'workspace/willDeleteFiles';
    WillDeleteFilesRequest.type = new messages$1.ProtocolRequestType(WillDeleteFilesRequest.method);
})(WillDeleteFilesRequest = exports.WillDeleteFilesRequest || (exports.WillDeleteFilesRequest = {}));

});

var protocol_moniker = createCommonjsModule(function (module, exports) {
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MonikerRequest = exports.MonikerKind = exports.UniquenessLevel = void 0;

/**
 * Moniker uniqueness level to define scope of the moniker.
 *
 * @since 3.16.0
 */
var UniquenessLevel;
(function (UniquenessLevel) {
    /**
     * The moniker is only unique inside a document
     */
    UniquenessLevel["document"] = "document";
    /**
     * The moniker is unique inside a project for which a dump got created
     */
    UniquenessLevel["project"] = "project";
    /**
     * The moniker is unique inside the group to which a project belongs
     */
    UniquenessLevel["group"] = "group";
    /**
     * The moniker is unique inside the moniker scheme.
     */
    UniquenessLevel["scheme"] = "scheme";
    /**
     * The moniker is globally unique
     */
    UniquenessLevel["global"] = "global";
})(UniquenessLevel = exports.UniquenessLevel || (exports.UniquenessLevel = {}));
/**
 * The moniker kind.
 *
 * @since 3.16.0
 */
var MonikerKind;
(function (MonikerKind) {
    /**
     * The moniker represent a symbol that is imported into a project
     */
    MonikerKind["import"] = "import";
    /**
     * The moniker represents a symbol that is exported from a project
     */
    MonikerKind["export"] = "export";
    /**
     * The moniker represents a symbol that is local to a project (e.g. a local
     * variable of a function, a class not visible outside the project, ...)
     */
    MonikerKind["local"] = "local";
})(MonikerKind = exports.MonikerKind || (exports.MonikerKind = {}));
/**
 * A request to get the moniker of a symbol at a given text document position.
 * The request parameter is of type [TextDocumentPositionParams](#TextDocumentPositionParams).
 * The response is of type [Moniker[]](#Moniker[]) or `null`.
 */
var MonikerRequest;
(function (MonikerRequest) {
    MonikerRequest.method = 'textDocument/moniker';
    MonikerRequest.type = new messages$1.ProtocolRequestType(MonikerRequest.method);
})(MonikerRequest = exports.MonikerRequest || (exports.MonikerRequest = {}));

});

var protocol = createCommonjsModule(function (module, exports) {
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentLinkRequest = exports.CodeLensRefreshRequest = exports.CodeLensResolveRequest = exports.CodeLensRequest = exports.WorkspaceSymbolRequest = exports.CodeActionResolveRequest = exports.CodeActionRequest = exports.DocumentSymbolRequest = exports.DocumentHighlightRequest = exports.ReferencesRequest = exports.DefinitionRequest = exports.SignatureHelpRequest = exports.SignatureHelpTriggerKind = exports.HoverRequest = exports.CompletionResolveRequest = exports.CompletionRequest = exports.CompletionTriggerKind = exports.PublishDiagnosticsNotification = exports.WatchKind = exports.FileChangeType = exports.DidChangeWatchedFilesNotification = exports.WillSaveTextDocumentWaitUntilRequest = exports.WillSaveTextDocumentNotification = exports.TextDocumentSaveReason = exports.DidSaveTextDocumentNotification = exports.DidCloseTextDocumentNotification = exports.DidChangeTextDocumentNotification = exports.TextDocumentContentChangeEvent = exports.DidOpenTextDocumentNotification = exports.TextDocumentSyncKind = exports.TelemetryEventNotification = exports.LogMessageNotification = exports.ShowMessageRequest = exports.ShowMessageNotification = exports.MessageType = exports.DidChangeConfigurationNotification = exports.ExitNotification = exports.ShutdownRequest = exports.InitializedNotification = exports.InitializeError = exports.InitializeRequest = exports.WorkDoneProgressOptions = exports.TextDocumentRegistrationOptions = exports.StaticRegistrationOptions = exports.FailureHandlingKind = exports.ResourceOperationKind = exports.UnregistrationRequest = exports.RegistrationRequest = exports.DocumentSelector = exports.DocumentFilter = void 0;
exports.MonikerRequest = exports.MonikerKind = exports.UniquenessLevel = exports.WillDeleteFilesRequest = exports.DidDeleteFilesNotification = exports.WillRenameFilesRequest = exports.DidRenameFilesNotification = exports.WillCreateFilesRequest = exports.DidCreateFilesNotification = exports.FileOperationPatternKind = exports.LinkedEditingRangeRequest = exports.ShowDocumentRequest = exports.SemanticTokensRegistrationType = exports.SemanticTokensRefreshRequest = exports.SemanticTokensRangeRequest = exports.SemanticTokensDeltaRequest = exports.SemanticTokensRequest = exports.TokenFormat = exports.SemanticTokens = exports.SemanticTokenModifiers = exports.SemanticTokenTypes = exports.CallHierarchyPrepareRequest = exports.CallHierarchyOutgoingCallsRequest = exports.CallHierarchyIncomingCallsRequest = exports.WorkDoneProgressCancelNotification = exports.WorkDoneProgressCreateRequest = exports.WorkDoneProgress = exports.SelectionRangeRequest = exports.DeclarationRequest = exports.FoldingRangeRequest = exports.ColorPresentationRequest = exports.DocumentColorRequest = exports.ConfigurationRequest = exports.DidChangeWorkspaceFoldersNotification = exports.WorkspaceFoldersRequest = exports.TypeDefinitionRequest = exports.ImplementationRequest = exports.ApplyWorkspaceEditRequest = exports.ExecuteCommandRequest = exports.PrepareRenameRequest = exports.RenameRequest = exports.PrepareSupportDefaultBehavior = exports.DocumentOnTypeFormattingRequest = exports.DocumentRangeFormattingRequest = exports.DocumentFormattingRequest = exports.DocumentLinkResolveRequest = void 0;



Object.defineProperty(exports, "ImplementationRequest", { enumerable: true, get: function () { return protocol_implementation.ImplementationRequest; } });

Object.defineProperty(exports, "TypeDefinitionRequest", { enumerable: true, get: function () { return protocol_typeDefinition.TypeDefinitionRequest; } });

Object.defineProperty(exports, "WorkspaceFoldersRequest", { enumerable: true, get: function () { return protocol_workspaceFolders.WorkspaceFoldersRequest; } });
Object.defineProperty(exports, "DidChangeWorkspaceFoldersNotification", { enumerable: true, get: function () { return protocol_workspaceFolders.DidChangeWorkspaceFoldersNotification; } });

Object.defineProperty(exports, "ConfigurationRequest", { enumerable: true, get: function () { return protocol_configuration.ConfigurationRequest; } });

Object.defineProperty(exports, "DocumentColorRequest", { enumerable: true, get: function () { return protocol_colorProvider.DocumentColorRequest; } });
Object.defineProperty(exports, "ColorPresentationRequest", { enumerable: true, get: function () { return protocol_colorProvider.ColorPresentationRequest; } });

Object.defineProperty(exports, "FoldingRangeRequest", { enumerable: true, get: function () { return protocol_foldingRange.FoldingRangeRequest; } });

Object.defineProperty(exports, "DeclarationRequest", { enumerable: true, get: function () { return protocol_declaration.DeclarationRequest; } });

Object.defineProperty(exports, "SelectionRangeRequest", { enumerable: true, get: function () { return protocol_selectionRange.SelectionRangeRequest; } });

Object.defineProperty(exports, "WorkDoneProgress", { enumerable: true, get: function () { return protocol_progress.WorkDoneProgress; } });
Object.defineProperty(exports, "WorkDoneProgressCreateRequest", { enumerable: true, get: function () { return protocol_progress.WorkDoneProgressCreateRequest; } });
Object.defineProperty(exports, "WorkDoneProgressCancelNotification", { enumerable: true, get: function () { return protocol_progress.WorkDoneProgressCancelNotification; } });

Object.defineProperty(exports, "CallHierarchyIncomingCallsRequest", { enumerable: true, get: function () { return protocol_callHierarchy.CallHierarchyIncomingCallsRequest; } });
Object.defineProperty(exports, "CallHierarchyOutgoingCallsRequest", { enumerable: true, get: function () { return protocol_callHierarchy.CallHierarchyOutgoingCallsRequest; } });
Object.defineProperty(exports, "CallHierarchyPrepareRequest", { enumerable: true, get: function () { return protocol_callHierarchy.CallHierarchyPrepareRequest; } });

Object.defineProperty(exports, "SemanticTokenTypes", { enumerable: true, get: function () { return protocol_semanticTokens.SemanticTokenTypes; } });
Object.defineProperty(exports, "SemanticTokenModifiers", { enumerable: true, get: function () { return protocol_semanticTokens.SemanticTokenModifiers; } });
Object.defineProperty(exports, "SemanticTokens", { enumerable: true, get: function () { return protocol_semanticTokens.SemanticTokens; } });
Object.defineProperty(exports, "TokenFormat", { enumerable: true, get: function () { return protocol_semanticTokens.TokenFormat; } });
Object.defineProperty(exports, "SemanticTokensRequest", { enumerable: true, get: function () { return protocol_semanticTokens.SemanticTokensRequest; } });
Object.defineProperty(exports, "SemanticTokensDeltaRequest", { enumerable: true, get: function () { return protocol_semanticTokens.SemanticTokensDeltaRequest; } });
Object.defineProperty(exports, "SemanticTokensRangeRequest", { enumerable: true, get: function () { return protocol_semanticTokens.SemanticTokensRangeRequest; } });
Object.defineProperty(exports, "SemanticTokensRefreshRequest", { enumerable: true, get: function () { return protocol_semanticTokens.SemanticTokensRefreshRequest; } });
Object.defineProperty(exports, "SemanticTokensRegistrationType", { enumerable: true, get: function () { return protocol_semanticTokens.SemanticTokensRegistrationType; } });

Object.defineProperty(exports, "ShowDocumentRequest", { enumerable: true, get: function () { return protocol_showDocument.ShowDocumentRequest; } });

Object.defineProperty(exports, "LinkedEditingRangeRequest", { enumerable: true, get: function () { return protocol_linkedEditingRange.LinkedEditingRangeRequest; } });

Object.defineProperty(exports, "FileOperationPatternKind", { enumerable: true, get: function () { return protocol_fileOperations.FileOperationPatternKind; } });
Object.defineProperty(exports, "DidCreateFilesNotification", { enumerable: true, get: function () { return protocol_fileOperations.DidCreateFilesNotification; } });
Object.defineProperty(exports, "WillCreateFilesRequest", { enumerable: true, get: function () { return protocol_fileOperations.WillCreateFilesRequest; } });
Object.defineProperty(exports, "DidRenameFilesNotification", { enumerable: true, get: function () { return protocol_fileOperations.DidRenameFilesNotification; } });
Object.defineProperty(exports, "WillRenameFilesRequest", { enumerable: true, get: function () { return protocol_fileOperations.WillRenameFilesRequest; } });
Object.defineProperty(exports, "DidDeleteFilesNotification", { enumerable: true, get: function () { return protocol_fileOperations.DidDeleteFilesNotification; } });
Object.defineProperty(exports, "WillDeleteFilesRequest", { enumerable: true, get: function () { return protocol_fileOperations.WillDeleteFilesRequest; } });

Object.defineProperty(exports, "UniquenessLevel", { enumerable: true, get: function () { return protocol_moniker.UniquenessLevel; } });
Object.defineProperty(exports, "MonikerKind", { enumerable: true, get: function () { return protocol_moniker.MonikerKind; } });
Object.defineProperty(exports, "MonikerRequest", { enumerable: true, get: function () { return protocol_moniker.MonikerRequest; } });
/**
 * The DocumentFilter namespace provides helper functions to work with
 * [DocumentFilter](#DocumentFilter) literals.
 */
var DocumentFilter;
(function (DocumentFilter) {
    function is(value) {
        const candidate = value;
        return is$2.string(candidate.language) || is$2.string(candidate.scheme) || is$2.string(candidate.pattern);
    }
    DocumentFilter.is = is;
})(DocumentFilter = exports.DocumentFilter || (exports.DocumentFilter = {}));
/**
 * The DocumentSelector namespace provides helper functions to work with
 * [DocumentSelector](#DocumentSelector)s.
 */
var DocumentSelector;
(function (DocumentSelector) {
    function is(value) {
        if (!Array.isArray(value)) {
            return false;
        }
        for (let elem of value) {
            if (!is$2.string(elem) && !DocumentFilter.is(elem)) {
                return false;
            }
        }
        return true;
    }
    DocumentSelector.is = is;
})(DocumentSelector = exports.DocumentSelector || (exports.DocumentSelector = {}));
/**
 * The `client/registerCapability` request is sent from the server to the client to register a new capability
 * handler on the client side.
 */
var RegistrationRequest;
(function (RegistrationRequest) {
    RegistrationRequest.type = new messages$1.ProtocolRequestType('client/registerCapability');
})(RegistrationRequest = exports.RegistrationRequest || (exports.RegistrationRequest = {}));
/**
 * The `client/unregisterCapability` request is sent from the server to the client to unregister a previously registered capability
 * handler on the client side.
 */
var UnregistrationRequest;
(function (UnregistrationRequest) {
    UnregistrationRequest.type = new messages$1.ProtocolRequestType('client/unregisterCapability');
})(UnregistrationRequest = exports.UnregistrationRequest || (exports.UnregistrationRequest = {}));
var ResourceOperationKind;
(function (ResourceOperationKind) {
    /**
     * Supports creating new files and folders.
     */
    ResourceOperationKind.Create = 'create';
    /**
     * Supports renaming existing files and folders.
     */
    ResourceOperationKind.Rename = 'rename';
    /**
     * Supports deleting existing files and folders.
     */
    ResourceOperationKind.Delete = 'delete';
})(ResourceOperationKind = exports.ResourceOperationKind || (exports.ResourceOperationKind = {}));
var FailureHandlingKind;
(function (FailureHandlingKind) {
    /**
     * Applying the workspace change is simply aborted if one of the changes provided
     * fails. All operations executed before the failing operation stay executed.
     */
    FailureHandlingKind.Abort = 'abort';
    /**
     * All operations are executed transactional. That means they either all
     * succeed or no changes at all are applied to the workspace.
     */
    FailureHandlingKind.Transactional = 'transactional';
    /**
     * If the workspace edit contains only textual file changes they are executed transactional.
     * If resource changes (create, rename or delete file) are part of the change the failure
     * handling strategy is abort.
     */
    FailureHandlingKind.TextOnlyTransactional = 'textOnlyTransactional';
    /**
     * The client tries to undo the operations already executed. But there is no
     * guarantee that this is succeeding.
     */
    FailureHandlingKind.Undo = 'undo';
})(FailureHandlingKind = exports.FailureHandlingKind || (exports.FailureHandlingKind = {}));
/**
 * The StaticRegistrationOptions namespace provides helper functions to work with
 * [StaticRegistrationOptions](#StaticRegistrationOptions) literals.
 */
var StaticRegistrationOptions;
(function (StaticRegistrationOptions) {
    function hasId(value) {
        const candidate = value;
        return candidate && is$2.string(candidate.id) && candidate.id.length > 0;
    }
    StaticRegistrationOptions.hasId = hasId;
})(StaticRegistrationOptions = exports.StaticRegistrationOptions || (exports.StaticRegistrationOptions = {}));
/**
 * The TextDocumentRegistrationOptions namespace provides helper functions to work with
 * [TextDocumentRegistrationOptions](#TextDocumentRegistrationOptions) literals.
 */
var TextDocumentRegistrationOptions;
(function (TextDocumentRegistrationOptions) {
    function is(value) {
        const candidate = value;
        return candidate && (candidate.documentSelector === null || DocumentSelector.is(candidate.documentSelector));
    }
    TextDocumentRegistrationOptions.is = is;
})(TextDocumentRegistrationOptions = exports.TextDocumentRegistrationOptions || (exports.TextDocumentRegistrationOptions = {}));
/**
 * The WorkDoneProgressOptions namespace provides helper functions to work with
 * [WorkDoneProgressOptions](#WorkDoneProgressOptions) literals.
 */
var WorkDoneProgressOptions;
(function (WorkDoneProgressOptions) {
    function is(value) {
        const candidate = value;
        return is$2.objectLiteral(candidate) && (candidate.workDoneProgress === undefined || is$2.boolean(candidate.workDoneProgress));
    }
    WorkDoneProgressOptions.is = is;
    function hasWorkDoneProgress(value) {
        const candidate = value;
        return candidate && is$2.boolean(candidate.workDoneProgress);
    }
    WorkDoneProgressOptions.hasWorkDoneProgress = hasWorkDoneProgress;
})(WorkDoneProgressOptions = exports.WorkDoneProgressOptions || (exports.WorkDoneProgressOptions = {}));
/**
 * The initialize request is sent from the client to the server.
 * It is sent once as the request after starting up the server.
 * The requests parameter is of type [InitializeParams](#InitializeParams)
 * the response if of type [InitializeResult](#InitializeResult) of a Thenable that
 * resolves to such.
 */
var InitializeRequest;
(function (InitializeRequest) {
    InitializeRequest.type = new messages$1.ProtocolRequestType('initialize');
})(InitializeRequest = exports.InitializeRequest || (exports.InitializeRequest = {}));
/**
 * Known error codes for an `InitializeError`;
 */
var InitializeError;
(function (InitializeError) {
    /**
     * If the protocol version provided by the client can't be handled by the server.
     * @deprecated This initialize error got replaced by client capabilities. There is
     * no version handshake in version 3.0x
     */
    InitializeError.unknownProtocolVersion = 1;
})(InitializeError = exports.InitializeError || (exports.InitializeError = {}));
/**
 * The initialized notification is sent from the client to the
 * server after the client is fully initialized and the server
 * is allowed to send requests from the server to the client.
 */
var InitializedNotification;
(function (InitializedNotification) {
    InitializedNotification.type = new messages$1.ProtocolNotificationType('initialized');
})(InitializedNotification = exports.InitializedNotification || (exports.InitializedNotification = {}));
//---- Shutdown Method ----
/**
 * A shutdown request is sent from the client to the server.
 * It is sent once when the client decides to shutdown the
 * server. The only notification that is sent after a shutdown request
 * is the exit event.
 */
var ShutdownRequest;
(function (ShutdownRequest) {
    ShutdownRequest.type = new messages$1.ProtocolRequestType0('shutdown');
})(ShutdownRequest = exports.ShutdownRequest || (exports.ShutdownRequest = {}));
//---- Exit Notification ----
/**
 * The exit event is sent from the client to the server to
 * ask the server to exit its process.
 */
var ExitNotification;
(function (ExitNotification) {
    ExitNotification.type = new messages$1.ProtocolNotificationType0('exit');
})(ExitNotification = exports.ExitNotification || (exports.ExitNotification = {}));
/**
 * The configuration change notification is sent from the client to the server
 * when the client's configuration has changed. The notification contains
 * the changed configuration as defined by the language client.
 */
var DidChangeConfigurationNotification;
(function (DidChangeConfigurationNotification) {
    DidChangeConfigurationNotification.type = new messages$1.ProtocolNotificationType('workspace/didChangeConfiguration');
})(DidChangeConfigurationNotification = exports.DidChangeConfigurationNotification || (exports.DidChangeConfigurationNotification = {}));
//---- Message show and log notifications ----
/**
 * The message type
 */
var MessageType;
(function (MessageType) {
    /**
     * An error message.
     */
    MessageType.Error = 1;
    /**
     * A warning message.
     */
    MessageType.Warning = 2;
    /**
     * An information message.
     */
    MessageType.Info = 3;
    /**
     * A log message.
     */
    MessageType.Log = 4;
})(MessageType = exports.MessageType || (exports.MessageType = {}));
/**
 * The show message notification is sent from a server to a client to ask
 * the client to display a particular message in the user interface.
 */
var ShowMessageNotification;
(function (ShowMessageNotification) {
    ShowMessageNotification.type = new messages$1.ProtocolNotificationType('window/showMessage');
})(ShowMessageNotification = exports.ShowMessageNotification || (exports.ShowMessageNotification = {}));
/**
 * The show message request is sent from the server to the client to show a message
 * and a set of options actions to the user.
 */
var ShowMessageRequest;
(function (ShowMessageRequest) {
    ShowMessageRequest.type = new messages$1.ProtocolRequestType('window/showMessageRequest');
})(ShowMessageRequest = exports.ShowMessageRequest || (exports.ShowMessageRequest = {}));
/**
 * The log message notification is sent from the server to the client to ask
 * the client to log a particular message.
 */
var LogMessageNotification;
(function (LogMessageNotification) {
    LogMessageNotification.type = new messages$1.ProtocolNotificationType('window/logMessage');
})(LogMessageNotification = exports.LogMessageNotification || (exports.LogMessageNotification = {}));
//---- Telemetry notification
/**
 * The telemetry event notification is sent from the server to the client to ask
 * the client to log telemetry data.
 */
var TelemetryEventNotification;
(function (TelemetryEventNotification) {
    TelemetryEventNotification.type = new messages$1.ProtocolNotificationType('telemetry/event');
})(TelemetryEventNotification = exports.TelemetryEventNotification || (exports.TelemetryEventNotification = {}));
/**
 * Defines how the host (editor) should sync
 * document changes to the language server.
 */
var TextDocumentSyncKind;
(function (TextDocumentSyncKind) {
    /**
     * Documents should not be synced at all.
     */
    TextDocumentSyncKind.None = 0;
    /**
     * Documents are synced by always sending the full content
     * of the document.
     */
    TextDocumentSyncKind.Full = 1;
    /**
     * Documents are synced by sending the full content on open.
     * After that only incremental updates to the document are
     * send.
     */
    TextDocumentSyncKind.Incremental = 2;
})(TextDocumentSyncKind = exports.TextDocumentSyncKind || (exports.TextDocumentSyncKind = {}));
/**
 * The document open notification is sent from the client to the server to signal
 * newly opened text documents. The document's truth is now managed by the client
 * and the server must not try to read the document's truth using the document's
 * uri. Open in this sense means it is managed by the client. It doesn't necessarily
 * mean that its content is presented in an editor. An open notification must not
 * be sent more than once without a corresponding close notification send before.
 * This means open and close notification must be balanced and the max open count
 * is one.
 */
var DidOpenTextDocumentNotification;
(function (DidOpenTextDocumentNotification) {
    DidOpenTextDocumentNotification.method = 'textDocument/didOpen';
    DidOpenTextDocumentNotification.type = new messages$1.ProtocolNotificationType(DidOpenTextDocumentNotification.method);
})(DidOpenTextDocumentNotification = exports.DidOpenTextDocumentNotification || (exports.DidOpenTextDocumentNotification = {}));
var TextDocumentContentChangeEvent;
(function (TextDocumentContentChangeEvent) {
    /**
     * Checks whether the information describes a delta event.
     */
    function isIncremental(event) {
        let candidate = event;
        return candidate !== undefined && candidate !== null &&
            typeof candidate.text === 'string' && candidate.range !== undefined &&
            (candidate.rangeLength === undefined || typeof candidate.rangeLength === 'number');
    }
    TextDocumentContentChangeEvent.isIncremental = isIncremental;
    /**
     * Checks whether the information describes a full replacement event.
     */
    function isFull(event) {
        let candidate = event;
        return candidate !== undefined && candidate !== null &&
            typeof candidate.text === 'string' && candidate.range === undefined && candidate.rangeLength === undefined;
    }
    TextDocumentContentChangeEvent.isFull = isFull;
})(TextDocumentContentChangeEvent = exports.TextDocumentContentChangeEvent || (exports.TextDocumentContentChangeEvent = {}));
/**
 * The document change notification is sent from the client to the server to signal
 * changes to a text document.
 */
var DidChangeTextDocumentNotification;
(function (DidChangeTextDocumentNotification) {
    DidChangeTextDocumentNotification.method = 'textDocument/didChange';
    DidChangeTextDocumentNotification.type = new messages$1.ProtocolNotificationType(DidChangeTextDocumentNotification.method);
})(DidChangeTextDocumentNotification = exports.DidChangeTextDocumentNotification || (exports.DidChangeTextDocumentNotification = {}));
/**
 * The document close notification is sent from the client to the server when
 * the document got closed in the client. The document's truth now exists where
 * the document's uri points to (e.g. if the document's uri is a file uri the
 * truth now exists on disk). As with the open notification the close notification
 * is about managing the document's content. Receiving a close notification
 * doesn't mean that the document was open in an editor before. A close
 * notification requires a previous open notification to be sent.
 */
var DidCloseTextDocumentNotification;
(function (DidCloseTextDocumentNotification) {
    DidCloseTextDocumentNotification.method = 'textDocument/didClose';
    DidCloseTextDocumentNotification.type = new messages$1.ProtocolNotificationType(DidCloseTextDocumentNotification.method);
})(DidCloseTextDocumentNotification = exports.DidCloseTextDocumentNotification || (exports.DidCloseTextDocumentNotification = {}));
/**
 * The document save notification is sent from the client to the server when
 * the document got saved in the client.
 */
var DidSaveTextDocumentNotification;
(function (DidSaveTextDocumentNotification) {
    DidSaveTextDocumentNotification.method = 'textDocument/didSave';
    DidSaveTextDocumentNotification.type = new messages$1.ProtocolNotificationType(DidSaveTextDocumentNotification.method);
})(DidSaveTextDocumentNotification = exports.DidSaveTextDocumentNotification || (exports.DidSaveTextDocumentNotification = {}));
/**
 * Represents reasons why a text document is saved.
 */
var TextDocumentSaveReason;
(function (TextDocumentSaveReason) {
    /**
     * Manually triggered, e.g. by the user pressing save, by starting debugging,
     * or by an API call.
     */
    TextDocumentSaveReason.Manual = 1;
    /**
     * Automatic after a delay.
     */
    TextDocumentSaveReason.AfterDelay = 2;
    /**
     * When the editor lost focus.
     */
    TextDocumentSaveReason.FocusOut = 3;
})(TextDocumentSaveReason = exports.TextDocumentSaveReason || (exports.TextDocumentSaveReason = {}));
/**
 * A document will save notification is sent from the client to the server before
 * the document is actually saved.
 */
var WillSaveTextDocumentNotification;
(function (WillSaveTextDocumentNotification) {
    WillSaveTextDocumentNotification.method = 'textDocument/willSave';
    WillSaveTextDocumentNotification.type = new messages$1.ProtocolNotificationType(WillSaveTextDocumentNotification.method);
})(WillSaveTextDocumentNotification = exports.WillSaveTextDocumentNotification || (exports.WillSaveTextDocumentNotification = {}));
/**
 * A document will save request is sent from the client to the server before
 * the document is actually saved. The request can return an array of TextEdits
 * which will be applied to the text document before it is saved. Please note that
 * clients might drop results if computing the text edits took too long or if a
 * server constantly fails on this request. This is done to keep the save fast and
 * reliable.
 */
var WillSaveTextDocumentWaitUntilRequest;
(function (WillSaveTextDocumentWaitUntilRequest) {
    WillSaveTextDocumentWaitUntilRequest.method = 'textDocument/willSaveWaitUntil';
    WillSaveTextDocumentWaitUntilRequest.type = new messages$1.ProtocolRequestType(WillSaveTextDocumentWaitUntilRequest.method);
})(WillSaveTextDocumentWaitUntilRequest = exports.WillSaveTextDocumentWaitUntilRequest || (exports.WillSaveTextDocumentWaitUntilRequest = {}));
/**
 * The watched files notification is sent from the client to the server when
 * the client detects changes to file watched by the language client.
 */
var DidChangeWatchedFilesNotification;
(function (DidChangeWatchedFilesNotification) {
    DidChangeWatchedFilesNotification.type = new messages$1.ProtocolNotificationType('workspace/didChangeWatchedFiles');
})(DidChangeWatchedFilesNotification = exports.DidChangeWatchedFilesNotification || (exports.DidChangeWatchedFilesNotification = {}));
/**
 * The file event type
 */
var FileChangeType;
(function (FileChangeType) {
    /**
     * The file got created.
     */
    FileChangeType.Created = 1;
    /**
     * The file got changed.
     */
    FileChangeType.Changed = 2;
    /**
     * The file got deleted.
     */
    FileChangeType.Deleted = 3;
})(FileChangeType = exports.FileChangeType || (exports.FileChangeType = {}));
var WatchKind;
(function (WatchKind) {
    /**
     * Interested in create events.
     */
    WatchKind.Create = 1;
    /**
     * Interested in change events
     */
    WatchKind.Change = 2;
    /**
     * Interested in delete events
     */
    WatchKind.Delete = 4;
})(WatchKind = exports.WatchKind || (exports.WatchKind = {}));
/**
 * Diagnostics notification are sent from the server to the client to signal
 * results of validation runs.
 */
var PublishDiagnosticsNotification;
(function (PublishDiagnosticsNotification) {
    PublishDiagnosticsNotification.type = new messages$1.ProtocolNotificationType('textDocument/publishDiagnostics');
})(PublishDiagnosticsNotification = exports.PublishDiagnosticsNotification || (exports.PublishDiagnosticsNotification = {}));
/**
 * How a completion was triggered
 */
var CompletionTriggerKind;
(function (CompletionTriggerKind) {
    /**
     * Completion was triggered by typing an identifier (24x7 code
     * complete), manual invocation (e.g Ctrl+Space) or via API.
     */
    CompletionTriggerKind.Invoked = 1;
    /**
     * Completion was triggered by a trigger character specified by
     * the `triggerCharacters` properties of the `CompletionRegistrationOptions`.
     */
    CompletionTriggerKind.TriggerCharacter = 2;
    /**
     * Completion was re-triggered as current completion list is incomplete
     */
    CompletionTriggerKind.TriggerForIncompleteCompletions = 3;
})(CompletionTriggerKind = exports.CompletionTriggerKind || (exports.CompletionTriggerKind = {}));
/**
 * Request to request completion at a given text document position. The request's
 * parameter is of type [TextDocumentPosition](#TextDocumentPosition) the response
 * is of type [CompletionItem[]](#CompletionItem) or [CompletionList](#CompletionList)
 * or a Thenable that resolves to such.
 *
 * The request can delay the computation of the [`detail`](#CompletionItem.detail)
 * and [`documentation`](#CompletionItem.documentation) properties to the `completionItem/resolve`
 * request. However, properties that are needed for the initial sorting and filtering, like `sortText`,
 * `filterText`, `insertText`, and `textEdit`, must not be changed during resolve.
 */
var CompletionRequest;
(function (CompletionRequest) {
    CompletionRequest.method = 'textDocument/completion';
    CompletionRequest.type = new messages$1.ProtocolRequestType(CompletionRequest.method);
})(CompletionRequest = exports.CompletionRequest || (exports.CompletionRequest = {}));
/**
 * Request to resolve additional information for a given completion item.The request's
 * parameter is of type [CompletionItem](#CompletionItem) the response
 * is of type [CompletionItem](#CompletionItem) or a Thenable that resolves to such.
 */
var CompletionResolveRequest;
(function (CompletionResolveRequest) {
    CompletionResolveRequest.method = 'completionItem/resolve';
    CompletionResolveRequest.type = new messages$1.ProtocolRequestType(CompletionResolveRequest.method);
})(CompletionResolveRequest = exports.CompletionResolveRequest || (exports.CompletionResolveRequest = {}));
/**
 * Request to request hover information at a given text document position. The request's
 * parameter is of type [TextDocumentPosition](#TextDocumentPosition) the response is of
 * type [Hover](#Hover) or a Thenable that resolves to such.
 */
var HoverRequest;
(function (HoverRequest) {
    HoverRequest.method = 'textDocument/hover';
    HoverRequest.type = new messages$1.ProtocolRequestType(HoverRequest.method);
})(HoverRequest = exports.HoverRequest || (exports.HoverRequest = {}));
/**
 * How a signature help was triggered.
 *
 * @since 3.15.0
 */
var SignatureHelpTriggerKind;
(function (SignatureHelpTriggerKind) {
    /**
     * Signature help was invoked manually by the user or by a command.
     */
    SignatureHelpTriggerKind.Invoked = 1;
    /**
     * Signature help was triggered by a trigger character.
     */
    SignatureHelpTriggerKind.TriggerCharacter = 2;
    /**
     * Signature help was triggered by the cursor moving or by the document content changing.
     */
    SignatureHelpTriggerKind.ContentChange = 3;
})(SignatureHelpTriggerKind = exports.SignatureHelpTriggerKind || (exports.SignatureHelpTriggerKind = {}));
var SignatureHelpRequest;
(function (SignatureHelpRequest) {
    SignatureHelpRequest.method = 'textDocument/signatureHelp';
    SignatureHelpRequest.type = new messages$1.ProtocolRequestType(SignatureHelpRequest.method);
})(SignatureHelpRequest = exports.SignatureHelpRequest || (exports.SignatureHelpRequest = {}));
/**
 * A request to resolve the definition location of a symbol at a given text
 * document position. The request's parameter is of type [TextDocumentPosition]
 * (#TextDocumentPosition) the response is of either type [Definition](#Definition)
 * or a typed array of [DefinitionLink](#DefinitionLink) or a Thenable that resolves
 * to such.
 */
var DefinitionRequest;
(function (DefinitionRequest) {
    DefinitionRequest.method = 'textDocument/definition';
    DefinitionRequest.type = new messages$1.ProtocolRequestType(DefinitionRequest.method);
})(DefinitionRequest = exports.DefinitionRequest || (exports.DefinitionRequest = {}));
/**
 * A request to resolve project-wide references for the symbol denoted
 * by the given text document position. The request's parameter is of
 * type [ReferenceParams](#ReferenceParams) the response is of type
 * [Location[]](#Location) or a Thenable that resolves to such.
 */
var ReferencesRequest;
(function (ReferencesRequest) {
    ReferencesRequest.method = 'textDocument/references';
    ReferencesRequest.type = new messages$1.ProtocolRequestType(ReferencesRequest.method);
})(ReferencesRequest = exports.ReferencesRequest || (exports.ReferencesRequest = {}));
/**
 * Request to resolve a [DocumentHighlight](#DocumentHighlight) for a given
 * text document position. The request's parameter is of type [TextDocumentPosition]
 * (#TextDocumentPosition) the request response is of type [DocumentHighlight[]]
 * (#DocumentHighlight) or a Thenable that resolves to such.
 */
var DocumentHighlightRequest;
(function (DocumentHighlightRequest) {
    DocumentHighlightRequest.method = 'textDocument/documentHighlight';
    DocumentHighlightRequest.type = new messages$1.ProtocolRequestType(DocumentHighlightRequest.method);
})(DocumentHighlightRequest = exports.DocumentHighlightRequest || (exports.DocumentHighlightRequest = {}));
/**
 * A request to list all symbols found in a given text document. The request's
 * parameter is of type [TextDocumentIdentifier](#TextDocumentIdentifier) the
 * response is of type [SymbolInformation[]](#SymbolInformation) or a Thenable
 * that resolves to such.
 */
var DocumentSymbolRequest;
(function (DocumentSymbolRequest) {
    DocumentSymbolRequest.method = 'textDocument/documentSymbol';
    DocumentSymbolRequest.type = new messages$1.ProtocolRequestType(DocumentSymbolRequest.method);
})(DocumentSymbolRequest = exports.DocumentSymbolRequest || (exports.DocumentSymbolRequest = {}));
/**
 * A request to provide commands for the given text document and range.
 */
var CodeActionRequest;
(function (CodeActionRequest) {
    CodeActionRequest.method = 'textDocument/codeAction';
    CodeActionRequest.type = new messages$1.ProtocolRequestType(CodeActionRequest.method);
})(CodeActionRequest = exports.CodeActionRequest || (exports.CodeActionRequest = {}));
/**
 * Request to resolve additional information for a given code action.The request's
 * parameter is of type [CodeAction](#CodeAction) the response
 * is of type [CodeAction](#CodeAction) or a Thenable that resolves to such.
 */
var CodeActionResolveRequest;
(function (CodeActionResolveRequest) {
    CodeActionResolveRequest.method = 'codeAction/resolve';
    CodeActionResolveRequest.type = new messages$1.ProtocolRequestType(CodeActionResolveRequest.method);
})(CodeActionResolveRequest = exports.CodeActionResolveRequest || (exports.CodeActionResolveRequest = {}));
/**
 * A request to list project-wide symbols matching the query string given
 * by the [WorkspaceSymbolParams](#WorkspaceSymbolParams). The response is
 * of type [SymbolInformation[]](#SymbolInformation) or a Thenable that
 * resolves to such.
 */
var WorkspaceSymbolRequest;
(function (WorkspaceSymbolRequest) {
    WorkspaceSymbolRequest.method = 'workspace/symbol';
    WorkspaceSymbolRequest.type = new messages$1.ProtocolRequestType(WorkspaceSymbolRequest.method);
})(WorkspaceSymbolRequest = exports.WorkspaceSymbolRequest || (exports.WorkspaceSymbolRequest = {}));
/**
 * A request to provide code lens for the given text document.
 */
var CodeLensRequest;
(function (CodeLensRequest) {
    CodeLensRequest.method = 'textDocument/codeLens';
    CodeLensRequest.type = new messages$1.ProtocolRequestType(CodeLensRequest.method);
})(CodeLensRequest = exports.CodeLensRequest || (exports.CodeLensRequest = {}));
/**
 * A request to resolve a command for a given code lens.
 */
var CodeLensResolveRequest;
(function (CodeLensResolveRequest) {
    CodeLensResolveRequest.method = 'codeLens/resolve';
    CodeLensResolveRequest.type = new messages$1.ProtocolRequestType(CodeLensResolveRequest.method);
})(CodeLensResolveRequest = exports.CodeLensResolveRequest || (exports.CodeLensResolveRequest = {}));
/**
 * A request to refresh all code actions
 *
 * @since 3.16.0
 */
var CodeLensRefreshRequest;
(function (CodeLensRefreshRequest) {
    CodeLensRefreshRequest.method = `workspace/codeLens/refresh`;
    CodeLensRefreshRequest.type = new messages$1.ProtocolRequestType0(CodeLensRefreshRequest.method);
})(CodeLensRefreshRequest = exports.CodeLensRefreshRequest || (exports.CodeLensRefreshRequest = {}));
/**
 * A request to provide document links
 */
var DocumentLinkRequest;
(function (DocumentLinkRequest) {
    DocumentLinkRequest.method = 'textDocument/documentLink';
    DocumentLinkRequest.type = new messages$1.ProtocolRequestType(DocumentLinkRequest.method);
})(DocumentLinkRequest = exports.DocumentLinkRequest || (exports.DocumentLinkRequest = {}));
/**
 * Request to resolve additional information for a given document link. The request's
 * parameter is of type [DocumentLink](#DocumentLink) the response
 * is of type [DocumentLink](#DocumentLink) or a Thenable that resolves to such.
 */
var DocumentLinkResolveRequest;
(function (DocumentLinkResolveRequest) {
    DocumentLinkResolveRequest.method = 'documentLink/resolve';
    DocumentLinkResolveRequest.type = new messages$1.ProtocolRequestType(DocumentLinkResolveRequest.method);
})(DocumentLinkResolveRequest = exports.DocumentLinkResolveRequest || (exports.DocumentLinkResolveRequest = {}));
/**
 * A request to to format a whole document.
 */
var DocumentFormattingRequest;
(function (DocumentFormattingRequest) {
    DocumentFormattingRequest.method = 'textDocument/formatting';
    DocumentFormattingRequest.type = new messages$1.ProtocolRequestType(DocumentFormattingRequest.method);
})(DocumentFormattingRequest = exports.DocumentFormattingRequest || (exports.DocumentFormattingRequest = {}));
/**
 * A request to to format a range in a document.
 */
var DocumentRangeFormattingRequest;
(function (DocumentRangeFormattingRequest) {
    DocumentRangeFormattingRequest.method = 'textDocument/rangeFormatting';
    DocumentRangeFormattingRequest.type = new messages$1.ProtocolRequestType(DocumentRangeFormattingRequest.method);
})(DocumentRangeFormattingRequest = exports.DocumentRangeFormattingRequest || (exports.DocumentRangeFormattingRequest = {}));
/**
 * A request to format a document on type.
 */
var DocumentOnTypeFormattingRequest;
(function (DocumentOnTypeFormattingRequest) {
    DocumentOnTypeFormattingRequest.method = 'textDocument/onTypeFormatting';
    DocumentOnTypeFormattingRequest.type = new messages$1.ProtocolRequestType(DocumentOnTypeFormattingRequest.method);
})(DocumentOnTypeFormattingRequest = exports.DocumentOnTypeFormattingRequest || (exports.DocumentOnTypeFormattingRequest = {}));
//---- Rename ----------------------------------------------
var PrepareSupportDefaultBehavior;
(function (PrepareSupportDefaultBehavior) {
    /**
     * The client's default behavior is to select the identifier
     * according the to language's syntax rule.
     */
    PrepareSupportDefaultBehavior.Identifier = 1;
})(PrepareSupportDefaultBehavior = exports.PrepareSupportDefaultBehavior || (exports.PrepareSupportDefaultBehavior = {}));
/**
 * A request to rename a symbol.
 */
var RenameRequest;
(function (RenameRequest) {
    RenameRequest.method = 'textDocument/rename';
    RenameRequest.type = new messages$1.ProtocolRequestType(RenameRequest.method);
})(RenameRequest = exports.RenameRequest || (exports.RenameRequest = {}));
/**
 * A request to test and perform the setup necessary for a rename.
 *
 * @since 3.16 - support for default behavior
 */
var PrepareRenameRequest;
(function (PrepareRenameRequest) {
    PrepareRenameRequest.method = 'textDocument/prepareRename';
    PrepareRenameRequest.type = new messages$1.ProtocolRequestType(PrepareRenameRequest.method);
})(PrepareRenameRequest = exports.PrepareRenameRequest || (exports.PrepareRenameRequest = {}));
/**
 * A request send from the client to the server to execute a command. The request might return
 * a workspace edit which the client will apply to the workspace.
 */
var ExecuteCommandRequest;
(function (ExecuteCommandRequest) {
    ExecuteCommandRequest.type = new messages$1.ProtocolRequestType('workspace/executeCommand');
})(ExecuteCommandRequest = exports.ExecuteCommandRequest || (exports.ExecuteCommandRequest = {}));
/**
 * A request sent from the server to the client to modified certain resources.
 */
var ApplyWorkspaceEditRequest;
(function (ApplyWorkspaceEditRequest) {
    ApplyWorkspaceEditRequest.type = new messages$1.ProtocolRequestType('workspace/applyEdit');
})(ApplyWorkspaceEditRequest = exports.ApplyWorkspaceEditRequest || (exports.ApplyWorkspaceEditRequest = {}));

});

var connection$1 = createCommonjsModule(function (module, exports) {
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProtocolConnection = void 0;

function createProtocolConnection(input, output, logger, options) {
    if (main.ConnectionStrategy.is(options)) {
        options = { connectionStrategy: options };
    }
    return main.createMessageConnection(input, output, logger, options);
}
exports.createProtocolConnection = createProtocolConnection;

});

var require$$1 = /*@__PURE__*/getAugmentedNamespace(main$1);

var api$1 = createCommonjsModule(function (module, exports) {
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (commonjsGlobal && commonjsGlobal.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LSPErrorCodes = exports.createProtocolConnection = void 0;
__exportStar(main, exports);
__exportStar(require$$1, exports);
__exportStar(messages$1, exports);
__exportStar(protocol, exports);

Object.defineProperty(exports, "createProtocolConnection", { enumerable: true, get: function () { return connection$1.createProtocolConnection; } });
var LSPErrorCodes;
(function (LSPErrorCodes) {
    /**
    * This is the start range of LSP reserved error codes.
    * It doesn't denote a real error code.
    *
    * @since 3.16.0
    */
    LSPErrorCodes.lspReservedErrorRangeStart = -32899;
    LSPErrorCodes.ContentModified = -32801;
    LSPErrorCodes.RequestCancelled = -32800;
    /**
    * This is the end range of LSP reserved error codes.
    * It doesn't denote a real error code.
    *
    * @since 3.16.0
    */
    LSPErrorCodes.lspReservedErrorRangeEnd = -32800;
})(LSPErrorCodes = exports.LSPErrorCodes || (exports.LSPErrorCodes = {}));

});

var main$2 = createCommonjsModule(function (module, exports) {
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (commonjsGlobal && commonjsGlobal.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProtocolConnection = void 0;

__exportStar(node, exports);
__exportStar(api$1, exports);
function createProtocolConnection(input, output, logger, options) {
    return node.createMessageConnection(input, output, logger, options);
}
exports.createProtocolConnection = createProtocolConnection;

});

var configuration = createCommonjsModule(function (module, exports) {
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
Object.defineProperty(exports, "__esModule", { value: true });
exports.toJSONObject = exports.ConfigurationFeature = void 0;


class ConfigurationFeature {
    constructor(_client) {
        this._client = _client;
    }
    fillClientCapabilities(capabilities) {
        capabilities.workspace = capabilities.workspace || {};
        capabilities.workspace.configuration = true;
    }
    initialize() {
        let client = this._client;
        client.onRequest(main$2.ConfigurationRequest.type, (params, token) => {
            let configuration = (params) => {
                let result = [];
                for (let item of params.items) {
                    let resource = item.scopeUri !== void 0 && item.scopeUri !== null ? this._client.protocol2CodeConverter.asUri(item.scopeUri) : undefined;
                    result.push(this.getConfiguration(resource, item.section !== null ? item.section : undefined));
                }
                return result;
            };
            let middleware = client.clientOptions.middleware.workspace;
            return middleware && middleware.configuration
                ? middleware.configuration(params, token, configuration)
                : configuration(params);
        });
    }
    getConfiguration(resource, section) {
        let result = null;
        if (section) {
            let index = section.lastIndexOf('.');
            if (index === -1) {
                result = toJSONObject(vscode__default['default'].workspace.getConfiguration(undefined, resource).get(section));
            }
            else {
                let config = vscode__default['default'].workspace.getConfiguration(section.substr(0, index), resource);
                if (config) {
                    result = toJSONObject(config.get(section.substr(index + 1)));
                }
            }
        }
        else {
            let config = vscode__default['default'].workspace.getConfiguration(undefined, resource);
            result = {};
            for (let key of Object.keys(config)) {
                if (config.has(key)) {
                    result[key] = toJSONObject(config.get(key));
                }
            }
        }
        if (result === undefined) {
            result = null;
        }
        return result;
    }
    dispose() {
    }
}
exports.ConfigurationFeature = ConfigurationFeature;
function toJSONObject(obj) {
    if (obj) {
        if (Array.isArray(obj)) {
            return obj.map(toJSONObject);
        }
        else if (typeof obj === 'object') {
            const res = Object.create(null);
            for (const key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key)) {
                    res[key] = toJSONObject(obj[key]);
                }
            }
            return res;
        }
    }
    return obj;
}
exports.toJSONObject = toJSONObject;

});

/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */


class ProtocolCompletionItem extends vscode__default['default'].CompletionItem {
    constructor(label) {
        super(label);
    }
}
var _default$2 = ProtocolCompletionItem;


var protocolCompletionItem = /*#__PURE__*/Object.defineProperty({
	default: _default$2
}, '__esModule', {value: true});

/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */


class ProtocolCodeLens extends vscode__default['default'].CodeLens {
    constructor(range) {
        super(range);
    }
}
var _default$3 = ProtocolCodeLens;


var protocolCodeLens = /*#__PURE__*/Object.defineProperty({
	default: _default$3
}, '__esModule', {value: true});

/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */


class ProtocolDocumentLink extends vscode__default['default'].DocumentLink {
    constructor(range, target) {
        super(range, target);
    }
}
var _default$4 = ProtocolDocumentLink;


var protocolDocumentLink = /*#__PURE__*/Object.defineProperty({
	default: _default$4
}, '__esModule', {value: true});

/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */


class ProtocolCodeAction extends vscode__default['default'].CodeAction {
    constructor(title, data) {
        super(title);
        this.data = data;
    }
}
var _default$5 = ProtocolCodeAction;


var protocolCodeAction = /*#__PURE__*/Object.defineProperty({
	default: _default$5
}, '__esModule', {value: true});

var protocolDiagnostic = createCommonjsModule(function (module, exports) {
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProtocolDiagnostic = exports.DiagnosticCode = void 0;


var DiagnosticCode;
(function (DiagnosticCode) {
    function is$1(value) {
        const candidate = value;
        return candidate !== undefined && candidate !== null && (is.number(candidate.value) || is.string(candidate.value)) && is.string(candidate.target);
    }
    DiagnosticCode.is = is$1;
})(DiagnosticCode = exports.DiagnosticCode || (exports.DiagnosticCode = {}));
class ProtocolDiagnostic extends vscode__default['default'].Diagnostic {
    constructor(range, message, severity, data) {
        super(range, message, severity);
        this.data = data;
        this.hasDiagnosticCode = false;
    }
}
exports.ProtocolDiagnostic = ProtocolDiagnostic;

});

/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */


class ProtocolCallHierarchyItem extends vscode__default['default'].CallHierarchyItem {
    constructor(kind, name, detail, uri, range, selectionRange, data) {
        super(kind, name, detail, uri, range, selectionRange);
        if (data !== undefined) {
            this.data = data;
        }
    }
}
var _default$6 = ProtocolCallHierarchyItem;


var protocolCallHierarchyItem = /*#__PURE__*/Object.defineProperty({
	default: _default$6
}, '__esModule', {value: true});

var codeConverter = createCommonjsModule(function (module, exports) {
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createConverter = void 0;









const vscode_languageserver_protocol_1 = main$2;
var InsertReplaceRange;
(function (InsertReplaceRange) {
    function is(value) {
        const candidate = value;
        return candidate && !!candidate.inserting && !!candidate.replacing;
    }
    InsertReplaceRange.is = is;
})(InsertReplaceRange || (InsertReplaceRange = {}));
function createConverter(uriConverter) {
    const nullConverter = (value) => value.toString();
    const _uriConverter = uriConverter || nullConverter;
    function asUri(value) {
        return _uriConverter(value);
    }
    function asTextDocumentIdentifier(textDocument) {
        return {
            uri: _uriConverter(textDocument.uri)
        };
    }
    function asVersionedTextDocumentIdentifier(textDocument) {
        return {
            uri: _uriConverter(textDocument.uri),
            version: textDocument.version
        };
    }
    function asOpenTextDocumentParams(textDocument) {
        return {
            textDocument: {
                uri: _uriConverter(textDocument.uri),
                languageId: textDocument.languageId,
                version: textDocument.version,
                text: textDocument.getText()
            }
        };
    }
    function isTextDocumentChangeEvent(value) {
        let candidate = value;
        return !!candidate.document && !!candidate.contentChanges;
    }
    function isTextDocument(value) {
        let candidate = value;
        return !!candidate.uri && !!candidate.version;
    }
    function asChangeTextDocumentParams(arg) {
        if (isTextDocument(arg)) {
            let result = {
                textDocument: {
                    uri: _uriConverter(arg.uri),
                    version: arg.version
                },
                contentChanges: [{ text: arg.getText() }]
            };
            return result;
        }
        else if (isTextDocumentChangeEvent(arg)) {
            let document = arg.document;
            let result = {
                textDocument: {
                    uri: _uriConverter(document.uri),
                    version: document.version
                },
                contentChanges: arg.contentChanges.map((change) => {
                    let range = change.range;
                    return {
                        range: {
                            start: { line: range.start.line, character: range.start.character },
                            end: { line: range.end.line, character: range.end.character }
                        },
                        rangeLength: change.rangeLength,
                        text: change.text
                    };
                })
            };
            return result;
        }
        else {
            throw Error('Unsupported text document change parameter');
        }
    }
    function asCloseTextDocumentParams(textDocument) {
        return {
            textDocument: asTextDocumentIdentifier(textDocument)
        };
    }
    function asSaveTextDocumentParams(textDocument, includeContent = false) {
        let result = {
            textDocument: asTextDocumentIdentifier(textDocument)
        };
        if (includeContent) {
            result.text = textDocument.getText();
        }
        return result;
    }
    function asTextDocumentSaveReason(reason) {
        switch (reason) {
            case vscode__default['default'].TextDocumentSaveReason.Manual:
                return main$2.TextDocumentSaveReason.Manual;
            case vscode__default['default'].TextDocumentSaveReason.AfterDelay:
                return main$2.TextDocumentSaveReason.AfterDelay;
            case vscode__default['default'].TextDocumentSaveReason.FocusOut:
                return main$2.TextDocumentSaveReason.FocusOut;
        }
        return main$2.TextDocumentSaveReason.Manual;
    }
    function asWillSaveTextDocumentParams(event) {
        return {
            textDocument: asTextDocumentIdentifier(event.document),
            reason: asTextDocumentSaveReason(event.reason)
        };
    }
    function asDidCreateFilesParams(event) {
        return {
            files: event.files.map((fileUri) => ({
                uri: _uriConverter(fileUri),
            })),
        };
    }
    function asDidRenameFilesParams(event) {
        return {
            files: event.files.map((file) => ({
                oldUri: _uriConverter(file.oldUri),
                newUri: _uriConverter(file.newUri),
            })),
        };
    }
    function asDidDeleteFilesParams(event) {
        return {
            files: event.files.map((fileUri) => ({
                uri: _uriConverter(fileUri),
            })),
        };
    }
    function asWillCreateFilesParams(event) {
        return {
            files: event.files.map((fileUri) => ({
                uri: _uriConverter(fileUri),
            })),
        };
    }
    function asWillRenameFilesParams(event) {
        return {
            files: event.files.map((file) => ({
                oldUri: _uriConverter(file.oldUri),
                newUri: _uriConverter(file.newUri),
            })),
        };
    }
    function asWillDeleteFilesParams(event) {
        return {
            files: event.files.map((fileUri) => ({
                uri: _uriConverter(fileUri),
            })),
        };
    }
    function asTextDocumentPositionParams(textDocument, position) {
        return {
            textDocument: asTextDocumentIdentifier(textDocument),
            position: asWorkerPosition(position)
        };
    }
    function asCompletionTriggerKind(triggerKind) {
        switch (triggerKind) {
            case vscode__default['default'].CompletionTriggerKind.TriggerCharacter:
                return main$2.CompletionTriggerKind.TriggerCharacter;
            case vscode__default['default'].CompletionTriggerKind.TriggerForIncompleteCompletions:
                return main$2.CompletionTriggerKind.TriggerForIncompleteCompletions;
            default:
                return main$2.CompletionTriggerKind.Invoked;
        }
    }
    function asCompletionParams(textDocument, position, context) {
        return {
            textDocument: asTextDocumentIdentifier(textDocument),
            position: asWorkerPosition(position),
            context: {
                triggerKind: asCompletionTriggerKind(context.triggerKind),
                triggerCharacter: context.triggerCharacter
            }
        };
    }
    function asSignatureHelpTriggerKind(triggerKind) {
        switch (triggerKind) {
            case vscode__default['default'].SignatureHelpTriggerKind.Invoke:
                return main$2.SignatureHelpTriggerKind.Invoked;
            case vscode__default['default'].SignatureHelpTriggerKind.TriggerCharacter:
                return main$2.SignatureHelpTriggerKind.TriggerCharacter;
            case vscode__default['default'].SignatureHelpTriggerKind.ContentChange:
                return main$2.SignatureHelpTriggerKind.ContentChange;
        }
    }
    function asParameterInformation(value) {
        // We leave the documentation out on purpose since it usually adds no
        // value for the server.
        return {
            label: value.label
        };
    }
    function asParameterInformations(values) {
        return values.map(asParameterInformation);
    }
    function asSignatureInformation(value) {
        // We leave the documentation out on purpose since it usually adds no
        // value for the server.
        return {
            label: value.label,
            parameters: asParameterInformations(value.parameters)
        };
    }
    function asSignatureInformations(values) {
        return values.map(asSignatureInformation);
    }
    function asSignatureHelp(value) {
        if (value === undefined) {
            return value;
        }
        return {
            signatures: asSignatureInformations(value.signatures),
            activeSignature: value.activeSignature,
            activeParameter: value.activeParameter
        };
    }
    function asSignatureHelpParams(textDocument, position, context) {
        return {
            textDocument: asTextDocumentIdentifier(textDocument),
            position: asWorkerPosition(position),
            context: {
                isRetrigger: context.isRetrigger,
                triggerCharacter: context.triggerCharacter,
                triggerKind: asSignatureHelpTriggerKind(context.triggerKind),
                activeSignatureHelp: asSignatureHelp(context.activeSignatureHelp)
            }
        };
    }
    function asWorkerPosition(position) {
        return { line: position.line, character: position.character };
    }
    function asPosition(value) {
        if (value === undefined || value === null) {
            return value;
        }
        return { line: value.line, character: value.character };
    }
    function asPositions(value) {
        let result = [];
        for (let elem of value) {
            result.push(asPosition(elem));
        }
        return result;
    }
    function asRange(value) {
        if (value === undefined || value === null) {
            return value;
        }
        return { start: asPosition(value.start), end: asPosition(value.end) };
    }
    function asLocation(value) {
        if (value === undefined || value === null) {
            return value;
        }
        return main$2.Location.create(asUri(value.uri), asRange(value.range));
    }
    function asDiagnosticSeverity(value) {
        switch (value) {
            case vscode__default['default'].DiagnosticSeverity.Error:
                return main$2.DiagnosticSeverity.Error;
            case vscode__default['default'].DiagnosticSeverity.Warning:
                return main$2.DiagnosticSeverity.Warning;
            case vscode__default['default'].DiagnosticSeverity.Information:
                return main$2.DiagnosticSeverity.Information;
            case vscode__default['default'].DiagnosticSeverity.Hint:
                return main$2.DiagnosticSeverity.Hint;
        }
    }
    function asDiagnosticTags(tags) {
        if (!tags) {
            return undefined;
        }
        let result = [];
        for (let tag of tags) {
            let converted = asDiagnosticTag(tag);
            if (converted !== undefined) {
                result.push(converted);
            }
        }
        return result.length > 0 ? result : undefined;
    }
    function asDiagnosticTag(tag) {
        switch (tag) {
            case vscode__default['default'].DiagnosticTag.Unnecessary:
                return main$2.DiagnosticTag.Unnecessary;
            case vscode__default['default'].DiagnosticTag.Deprecated:
                return main$2.DiagnosticTag.Deprecated;
            default:
                return undefined;
        }
    }
    function asRelatedInformation(item) {
        return {
            message: item.message,
            location: asLocation(item.location)
        };
    }
    function asRelatedInformations(items) {
        return items.map(asRelatedInformation);
    }
    function asDiagnosticCode(value) {
        if (value === undefined || value === null) {
            return undefined;
        }
        if (is.number(value) || is.string(value)) {
            return value;
        }
        return { value: value.value, target: asUri(value.target) };
    }
    function asDiagnostic(item) {
        const result = main$2.Diagnostic.create(asRange(item.range), item.message);
        const protocolDiagnostic$1 = item instanceof protocolDiagnostic.ProtocolDiagnostic ? item : undefined;
        if (protocolDiagnostic$1 !== undefined && protocolDiagnostic$1.data !== undefined) {
            result.data = protocolDiagnostic$1.data;
        }
        const code = asDiagnosticCode(item.code);
        if (protocolDiagnostic.DiagnosticCode.is(code)) {
            if (protocolDiagnostic$1 !== undefined && protocolDiagnostic$1.hasDiagnosticCode) {
                result.code = code;
            }
            else {
                result.code = code.value;
                result.codeDescription = { href: code.target };
            }
        }
        else {
            result.code = code;
        }
        if (is.number(item.severity)) {
            result.severity = asDiagnosticSeverity(item.severity);
        }
        if (Array.isArray(item.tags)) {
            result.tags = asDiagnosticTags(item.tags);
        }
        if (item.relatedInformation) {
            result.relatedInformation = asRelatedInformations(item.relatedInformation);
        }
        if (item.source) {
            result.source = item.source;
        }
        return result;
    }
    function asDiagnostics(items) {
        if (items === undefined || items === null) {
            return items;
        }
        return items.map(asDiagnostic);
    }
    function asDocumentation(format, documentation) {
        switch (format) {
            case '$string':
                return documentation;
            case main$2.MarkupKind.PlainText:
                return { kind: format, value: documentation };
            case main$2.MarkupKind.Markdown:
                return { kind: format, value: documentation.value };
            default:
                return `Unsupported Markup content received. Kind is: ${format}`;
        }
    }
    function asCompletionItemTag(tag) {
        switch (tag) {
            case vscode__default['default'].CompletionItemTag.Deprecated:
                return main$2.CompletionItemTag.Deprecated;
        }
        return undefined;
    }
    function asCompletionItemTags(tags) {
        if (tags === undefined) {
            return tags;
        }
        const result = [];
        for (let tag of tags) {
            const converted = asCompletionItemTag(tag);
            if (converted !== undefined) {
                result.push(converted);
            }
        }
        return result;
    }
    function asCompletionItemKind(value, original) {
        if (original !== undefined) {
            return original;
        }
        return value + 1;
    }
    function asCompletionItem(item) {
        let result = { label: item.label };
        let protocolItem = item instanceof protocolCompletionItem.default ? item : undefined;
        if (item.detail) {
            result.detail = item.detail;
        }
        // We only send items back we created. So this can't be something else than
        // a string right now.
        if (item.documentation) {
            if (!protocolItem || protocolItem.documentationFormat === '$string') {
                result.documentation = item.documentation;
            }
            else {
                result.documentation = asDocumentation(protocolItem.documentationFormat, item.documentation);
            }
        }
        if (item.filterText) {
            result.filterText = item.filterText;
        }
        fillPrimaryInsertText(result, item);
        if (is.number(item.kind)) {
            result.kind = asCompletionItemKind(item.kind, protocolItem && protocolItem.originalItemKind);
        }
        if (item.sortText) {
            result.sortText = item.sortText;
        }
        if (item.additionalTextEdits) {
            result.additionalTextEdits = asTextEdits(item.additionalTextEdits);
        }
        if (item.commitCharacters) {
            result.commitCharacters = item.commitCharacters.slice();
        }
        if (item.command) {
            result.command = asCommand(item.command);
        }
        if (item.preselect === true || item.preselect === false) {
            result.preselect = item.preselect;
        }
        const tags = asCompletionItemTags(item.tags);
        if (protocolItem) {
            if (protocolItem.data !== undefined) {
                result.data = protocolItem.data;
            }
            if (protocolItem.deprecated === true || protocolItem.deprecated === false) {
                if (protocolItem.deprecated === true && tags !== undefined && tags.length > 0) {
                    const index = tags.indexOf(vscode__default['default'].CompletionItemTag.Deprecated);
                    if (index !== -1) {
                        tags.splice(index, 1);
                    }
                }
                result.deprecated = protocolItem.deprecated;
            }
            if (protocolItem.insertTextMode !== undefined) {
                result.insertTextMode = protocolItem.insertTextMode;
            }
        }
        if (tags !== undefined && tags.length > 0) {
            result.tags = tags;
        }
        if (result.insertTextMode === undefined && item.keepWhitespace === true) {
            result.insertTextMode = vscode_languageserver_protocol_1.InsertTextMode.adjustIndentation;
        }
        return result;
    }
    function fillPrimaryInsertText(target, source) {
        let format = main$2.InsertTextFormat.PlainText;
        let text = undefined;
        let range = undefined;
        if (source.textEdit) {
            text = source.textEdit.newText;
            range = source.textEdit.range;
        }
        else if (source.insertText instanceof vscode__default['default'].SnippetString) {
            format = main$2.InsertTextFormat.Snippet;
            text = source.insertText.value;
        }
        else {
            text = source.insertText;
        }
        if (source.range) {
            range = source.range;
        }
        target.insertTextFormat = format;
        if (source.fromEdit && text !== undefined && range !== undefined) {
            target.textEdit = asCompletionTextEdit(text, range);
        }
        else {
            target.insertText = text;
        }
    }
    function asCompletionTextEdit(newText, range) {
        if (InsertReplaceRange.is(range)) {
            return main$2.InsertReplaceEdit.create(newText, asRange(range.inserting), asRange(range.replacing));
        }
        else {
            return { newText, range: asRange(range) };
        }
    }
    function asTextEdit(edit) {
        return { range: asRange(edit.range), newText: edit.newText };
    }
    function asTextEdits(edits) {
        if (edits === undefined || edits === null) {
            return edits;
        }
        return edits.map(asTextEdit);
    }
    function asSymbolKind(item) {
        if (item <= vscode__default['default'].SymbolKind.TypeParameter) {
            // Symbol kind is one based in the protocol and zero based in code.
            return (item + 1);
        }
        return main$2.SymbolKind.Property;
    }
    function asSymbolTag(item) {
        return item;
    }
    function asSymbolTags(items) {
        return items.map(asSymbolTag);
    }
    function asReferenceParams(textDocument, position, options) {
        return {
            textDocument: asTextDocumentIdentifier(textDocument),
            position: asWorkerPosition(position),
            context: { includeDeclaration: options.includeDeclaration }
        };
    }
    function asCodeAction(item) {
        let result = main$2.CodeAction.create(item.title);
        if (item instanceof protocolCodeAction.default && item.data !== undefined) {
            result.data = item.data;
        }
        if (item.kind !== undefined) {
            result.kind = asCodeActionKind(item.kind);
        }
        if (item.diagnostics !== undefined) {
            result.diagnostics = asDiagnostics(item.diagnostics);
        }
        if (item.edit !== undefined) {
            throw new Error(`VS Code code actions can only be converted to a protocol code action without an edit.`);
        }
        if (item.command !== undefined) {
            result.command = asCommand(item.command);
        }
        if (item.isPreferred !== undefined) {
            result.isPreferred = item.isPreferred;
        }
        if (item.disabled !== undefined) {
            result.disabled = { reason: item.disabled.reason };
        }
        return result;
    }
    function asCodeActionContext(context) {
        if (context === undefined || context === null) {
            return context;
        }
        let only;
        if (context.only && is.string(context.only.value)) {
            only = [context.only.value];
        }
        return main$2.CodeActionContext.create(asDiagnostics(context.diagnostics), only);
    }
    function asCodeActionKind(item) {
        if (item === undefined || item === null) {
            return undefined;
        }
        return item.value;
    }
    function asCommand(item) {
        let result = main$2.Command.create(item.title, item.command);
        if (item.arguments) {
            result.arguments = item.arguments;
        }
        return result;
    }
    function asCodeLens(item) {
        let result = main$2.CodeLens.create(asRange(item.range));
        if (item.command) {
            result.command = asCommand(item.command);
        }
        if (item instanceof protocolCodeLens.default) {
            if (item.data) {
                result.data = item.data;
            }
        }
        return result;
    }
    function asFormattingOptions(options, fileOptions) {
        const result = { tabSize: options.tabSize, insertSpaces: options.insertSpaces };
        if (fileOptions.trimTrailingWhitespace) {
            result.trimTrailingWhitespace = true;
        }
        if (fileOptions.trimFinalNewlines) {
            result.trimFinalNewlines = true;
        }
        if (fileOptions.insertFinalNewline) {
            result.insertFinalNewline = true;
        }
        return result;
    }
    function asDocumentSymbolParams(textDocument) {
        return {
            textDocument: asTextDocumentIdentifier(textDocument)
        };
    }
    function asCodeLensParams(textDocument) {
        return {
            textDocument: asTextDocumentIdentifier(textDocument)
        };
    }
    function asDocumentLink(item) {
        let result = main$2.DocumentLink.create(asRange(item.range));
        if (item.target) {
            result.target = asUri(item.target);
        }
        if (item.tooltip !== undefined) {
            result.tooltip = item.tooltip;
        }
        let protocolItem = item instanceof protocolDocumentLink.default ? item : undefined;
        if (protocolItem && protocolItem.data) {
            result.data = protocolItem.data;
        }
        return result;
    }
    function asDocumentLinkParams(textDocument) {
        return {
            textDocument: asTextDocumentIdentifier(textDocument)
        };
    }
    function asCallHierarchyItem(value) {
        const result = {
            name: value.name,
            kind: asSymbolKind(value.kind),
            uri: asUri(value.uri),
            range: asRange(value.range),
            selectionRange: asRange(value.selectionRange)
        };
        if (value.detail !== undefined && value.detail.length > 0) {
            result.detail = value.detail;
        }
        if (value.tags !== undefined) {
            result.tags = asSymbolTags(value.tags);
        }
        if (value instanceof protocolCallHierarchyItem.default && value.data !== undefined) {
            result.data = value.data;
        }
        return result;
    }
    return {
        asUri,
        asTextDocumentIdentifier,
        asVersionedTextDocumentIdentifier,
        asOpenTextDocumentParams,
        asChangeTextDocumentParams,
        asCloseTextDocumentParams,
        asSaveTextDocumentParams,
        asWillSaveTextDocumentParams,
        asDidCreateFilesParams,
        asDidRenameFilesParams,
        asDidDeleteFilesParams,
        asWillCreateFilesParams,
        asWillRenameFilesParams,
        asWillDeleteFilesParams,
        asTextDocumentPositionParams,
        asCompletionParams,
        asSignatureHelpParams,
        asWorkerPosition,
        asRange,
        asPosition,
        asPositions,
        asLocation,
        asDiagnosticSeverity,
        asDiagnosticTag,
        asDiagnostic,
        asDiagnostics,
        asCompletionItem,
        asTextEdit,
        asSymbolKind,
        asSymbolTag,
        asSymbolTags,
        asReferenceParams,
        asCodeAction,
        asCodeActionContext,
        asCommand,
        asCodeLens,
        asFormattingOptions,
        asDocumentSymbolParams,
        asCodeLensParams,
        asDocumentLink,
        asDocumentLinkParams,
        asCallHierarchyItem
    };
}
exports.createConverter = createConverter;

});

var protocolConverter = createCommonjsModule(function (module, exports) {
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
/// <reference path="../../typings/vscode-proposed.d.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
exports.createConverter = void 0;









const vscode_languageserver_protocol_1 = main$2;
var CodeBlock;
(function (CodeBlock) {
    function is$1(value) {
        let candidate = value;
        return candidate && is.string(candidate.language) && is.string(candidate.value);
    }
    CodeBlock.is = is$1;
})(CodeBlock || (CodeBlock = {}));
function createConverter(uriConverter, trustMarkdown) {
    const nullConverter = (value) => vscode__default['default'].Uri.parse(value);
    const _uriConverter = uriConverter || nullConverter;
    function asUri(value) {
        return _uriConverter(value);
    }
    function asDiagnostics(diagnostics) {
        return diagnostics.map(asDiagnostic);
    }
    function asDiagnostic(diagnostic) {
        let result = new protocolDiagnostic.ProtocolDiagnostic(asRange(diagnostic.range), diagnostic.message, asDiagnosticSeverity(diagnostic.severity), diagnostic.data);
        if (diagnostic.code !== undefined) {
            if (main$2.CodeDescription.is(diagnostic.codeDescription)) {
                result.code = {
                    value: diagnostic.code,
                    target: asUri(diagnostic.codeDescription.href)
                };
            }
            else if (protocolDiagnostic.DiagnosticCode.is(diagnostic.code)) {
                result.hasDiagnosticCode = true;
                result.code = {
                    value: diagnostic.code.value,
                    target: asUri(diagnostic.code.target)
                };
            }
            else {
                result.code = diagnostic.code;
            }
        }
        if (diagnostic.source) {
            result.source = diagnostic.source;
        }
        if (diagnostic.relatedInformation) {
            result.relatedInformation = asRelatedInformation(diagnostic.relatedInformation);
        }
        if (Array.isArray(diagnostic.tags)) {
            result.tags = asDiagnosticTags(diagnostic.tags);
        }
        return result;
    }
    function asRelatedInformation(relatedInformation) {
        return relatedInformation.map(asDiagnosticRelatedInformation);
    }
    function asDiagnosticRelatedInformation(information) {
        return new vscode__default['default'].DiagnosticRelatedInformation(asLocation(information.location), information.message);
    }
    function asDiagnosticTags(tags) {
        if (!tags) {
            return undefined;
        }
        let result = [];
        for (let tag of tags) {
            let converted = asDiagnosticTag(tag);
            if (converted !== undefined) {
                result.push(converted);
            }
        }
        return result.length > 0 ? result : undefined;
    }
    function asDiagnosticTag(tag) {
        switch (tag) {
            case main$2.DiagnosticTag.Unnecessary:
                return vscode__default['default'].DiagnosticTag.Unnecessary;
            case main$2.DiagnosticTag.Deprecated:
                return vscode__default['default'].DiagnosticTag.Deprecated;
            default:
                return undefined;
        }
    }
    function asPosition(value) {
        if (!value) {
            return undefined;
        }
        return new vscode__default['default'].Position(value.line, value.character);
    }
    function asRange(value) {
        if (!value) {
            return undefined;
        }
        return new vscode__default['default'].Range(asPosition(value.start), asPosition(value.end));
    }
    function asRanges(value) {
        return value.map(value => asRange(value));
    }
    function asDiagnosticSeverity(value) {
        if (value === undefined || value === null) {
            return vscode__default['default'].DiagnosticSeverity.Error;
        }
        switch (value) {
            case main$2.DiagnosticSeverity.Error:
                return vscode__default['default'].DiagnosticSeverity.Error;
            case main$2.DiagnosticSeverity.Warning:
                return vscode__default['default'].DiagnosticSeverity.Warning;
            case main$2.DiagnosticSeverity.Information:
                return vscode__default['default'].DiagnosticSeverity.Information;
            case main$2.DiagnosticSeverity.Hint:
                return vscode__default['default'].DiagnosticSeverity.Hint;
        }
        return vscode__default['default'].DiagnosticSeverity.Error;
    }
    function asHoverContent(value) {
        if (is.string(value)) {
            return asMarkdownString(value);
        }
        else if (CodeBlock.is(value)) {
            let result = asMarkdownString();
            return result.appendCodeblock(value.value, value.language);
        }
        else if (Array.isArray(value)) {
            let result = [];
            for (let element of value) {
                let item = asMarkdownString();
                if (CodeBlock.is(element)) {
                    item.appendCodeblock(element.value, element.language);
                }
                else {
                    item.appendMarkdown(element);
                }
                result.push(item);
            }
            return result;
        }
        else {
            let result;
            switch (value.kind) {
                case main$2.MarkupKind.Markdown:
                    return asMarkdownString(value.value);
                case main$2.MarkupKind.PlainText:
                    result = asMarkdownString();
                    result.appendText(value.value);
                    return result;
                default:
                    result = asMarkdownString();
                    result.appendText(`Unsupported Markup content received. Kind is: ${value.kind}`);
                    return result;
            }
        }
    }
    function asDocumentation(value) {
        if (is.string(value)) {
            return value;
        }
        else {
            switch (value.kind) {
                case main$2.MarkupKind.Markdown:
                    return asMarkdownString(value.value);
                case main$2.MarkupKind.PlainText:
                    return value.value;
                default:
                    return `Unsupported Markup content received. Kind is: ${value.kind}`;
            }
        }
    }
    function asMarkdownString(value) {
        const result = new vscode__default['default'].MarkdownString(value);
        if (trustMarkdown === true) {
            result.isTrusted = trustMarkdown;
        }
        return result;
    }
    function asHover(hover) {
        if (!hover) {
            return undefined;
        }
        return new vscode__default['default'].Hover(asHoverContent(hover.contents), asRange(hover.range));
    }
    function asCompletionResult(result) {
        if (!result) {
            return undefined;
        }
        if (Array.isArray(result)) {
            let items = result;
            return items.map(asCompletionItem);
        }
        let list = result;
        return new vscode__default['default'].CompletionList(list.items.map(asCompletionItem), list.isIncomplete);
    }
    function asCompletionItemKind(value) {
        // Protocol item kind is 1 based, codes item kind is zero based.
        if (main$2.CompletionItemKind.Text <= value && value <= main$2.CompletionItemKind.TypeParameter) {
            return [value - 1, undefined];
        }
        return [vscode__default['default'].CompletionItemKind.Text, value];
    }
    function asCompletionItemTag(tag) {
        switch (tag) {
            case main$2.CompletionItemTag.Deprecated:
                return vscode__default['default'].CompletionItemTag.Deprecated;
        }
        return undefined;
    }
    function asCompletionItemTags(tags) {
        if (tags === undefined || tags === null) {
            return [];
        }
        const result = [];
        for (let tag of tags) {
            const converted = asCompletionItemTag(tag);
            if (converted !== undefined) {
                result.push(converted);
            }
        }
        return result;
    }
    function asCompletionItem(item) {
        let tags = asCompletionItemTags(item.tags);
        let result = new protocolCompletionItem.default(item.label);
        if (item.detail) {
            result.detail = item.detail;
        }
        if (item.documentation) {
            result.documentation = asDocumentation(item.documentation);
            result.documentationFormat = is.string(item.documentation) ? '$string' : item.documentation.kind;
        }
        if (item.filterText) {
            result.filterText = item.filterText;
        }
        let insertText = asCompletionInsertText(item);
        if (insertText) {
            result.insertText = insertText.text;
            result.range = insertText.range;
            result.fromEdit = insertText.fromEdit;
        }
        if (is.number(item.kind)) {
            let [itemKind, original] = asCompletionItemKind(item.kind);
            result.kind = itemKind;
            if (original) {
                result.originalItemKind = original;
            }
        }
        if (item.sortText) {
            result.sortText = item.sortText;
        }
        if (item.additionalTextEdits) {
            result.additionalTextEdits = asTextEdits(item.additionalTextEdits);
        }
        if (is.stringArray(item.commitCharacters)) {
            result.commitCharacters = item.commitCharacters.slice();
        }
        if (item.command) {
            result.command = asCommand(item.command);
        }
        if (item.deprecated === true || item.deprecated === false) {
            result.deprecated = item.deprecated;
            if (item.deprecated === true) {
                tags.push(vscode__default['default'].CompletionItemTag.Deprecated);
            }
        }
        if (item.preselect === true || item.preselect === false) {
            result.preselect = item.preselect;
        }
        if (item.data !== undefined) {
            result.data = item.data;
        }
        if (tags.length > 0) {
            result.tags = tags;
        }
        if (item.insertTextMode !== undefined) {
            result.insertTextMode = item.insertTextMode;
            if (item.insertTextMode === vscode_languageserver_protocol_1.InsertTextMode.asIs) {
                result.keepWhitespace = true;
            }
        }
        return result;
    }
    function asCompletionInsertText(item) {
        if (item.textEdit) {
            if (item.insertTextFormat === main$2.InsertTextFormat.Snippet) {
                return { text: new vscode__default['default'].SnippetString(item.textEdit.newText), range: asCompletionRange(item.textEdit), fromEdit: true };
            }
            else {
                return { text: item.textEdit.newText, range: asCompletionRange(item.textEdit), fromEdit: true };
            }
        }
        else if (item.insertText) {
            if (item.insertTextFormat === main$2.InsertTextFormat.Snippet) {
                return { text: new vscode__default['default'].SnippetString(item.insertText), fromEdit: false };
            }
            else {
                return { text: item.insertText, fromEdit: false };
            }
        }
        else {
            return undefined;
        }
    }
    function asCompletionRange(value) {
        if (main$2.InsertReplaceEdit.is(value)) {
            return { inserting: asRange(value.insert), replacing: asRange(value.replace) };
        }
        else {
            return asRange(value.range);
        }
    }
    function asTextEdit(edit) {
        if (!edit) {
            return undefined;
        }
        return new vscode__default['default'].TextEdit(asRange(edit.range), edit.newText);
    }
    function asTextEdits(items) {
        if (!items) {
            return undefined;
        }
        return items.map(asTextEdit);
    }
    function asSignatureHelp(item) {
        if (!item) {
            return undefined;
        }
        let result = new vscode__default['default'].SignatureHelp();
        if (is.number(item.activeSignature)) {
            result.activeSignature = item.activeSignature;
        }
        else {
            // activeSignature was optional in the past
            result.activeSignature = 0;
        }
        if (is.number(item.activeParameter)) {
            result.activeParameter = item.activeParameter;
        }
        else {
            // activeParameter was optional in the past
            result.activeParameter = 0;
        }
        if (item.signatures) {
            result.signatures = asSignatureInformations(item.signatures);
        }
        return result;
    }
    function asSignatureInformations(items) {
        return items.map(asSignatureInformation);
    }
    function asSignatureInformation(item) {
        let result = new vscode__default['default'].SignatureInformation(item.label);
        if (item.documentation !== undefined) {
            result.documentation = asDocumentation(item.documentation);
        }
        if (item.parameters !== undefined) {
            result.parameters = asParameterInformations(item.parameters);
        }
        if (item.activeParameter !== undefined) {
            result.activeParameter = item.activeParameter;
        }
        {
            return result;
        }
    }
    function asParameterInformations(item) {
        return item.map(asParameterInformation);
    }
    function asParameterInformation(item) {
        let result = new vscode__default['default'].ParameterInformation(item.label);
        if (item.documentation) {
            result.documentation = asDocumentation(item.documentation);
        }
        return result;
    }
    function asLocation(item) {
        if (!item) {
            return undefined;
        }
        return new vscode__default['default'].Location(_uriConverter(item.uri), asRange(item.range));
    }
    function asDeclarationResult(item) {
        if (!item) {
            return undefined;
        }
        return asLocationResult(item);
    }
    function asDefinitionResult(item) {
        if (!item) {
            return undefined;
        }
        return asLocationResult(item);
    }
    function asLocationLink(item) {
        if (!item) {
            return undefined;
        }
        let result = {
            targetUri: _uriConverter(item.targetUri),
            targetRange: asRange(item.targetRange),
            originSelectionRange: asRange(item.originSelectionRange),
            targetSelectionRange: asRange(item.targetSelectionRange)
        };
        if (!result.targetSelectionRange) {
            throw new Error(`targetSelectionRange must not be undefined or null`);
        }
        return result;
    }
    function asLocationResult(item) {
        if (!item) {
            return undefined;
        }
        if (is.array(item)) {
            if (item.length === 0) {
                return [];
            }
            else if (main$2.LocationLink.is(item[0])) {
                let links = item;
                return links.map((link) => asLocationLink(link));
            }
            else {
                let locations = item;
                return locations.map((location) => asLocation(location));
            }
        }
        else if (main$2.LocationLink.is(item)) {
            return [asLocationLink(item)];
        }
        else {
            return asLocation(item);
        }
    }
    function asReferences(values) {
        if (!values) {
            return undefined;
        }
        return values.map(location => asLocation(location));
    }
    function asDocumentHighlights(values) {
        if (!values) {
            return undefined;
        }
        return values.map(asDocumentHighlight);
    }
    function asDocumentHighlight(item) {
        let result = new vscode__default['default'].DocumentHighlight(asRange(item.range));
        if (is.number(item.kind)) {
            result.kind = asDocumentHighlightKind(item.kind);
        }
        return result;
    }
    function asDocumentHighlightKind(item) {
        switch (item) {
            case main$2.DocumentHighlightKind.Text:
                return vscode__default['default'].DocumentHighlightKind.Text;
            case main$2.DocumentHighlightKind.Read:
                return vscode__default['default'].DocumentHighlightKind.Read;
            case main$2.DocumentHighlightKind.Write:
                return vscode__default['default'].DocumentHighlightKind.Write;
        }
        return vscode__default['default'].DocumentHighlightKind.Text;
    }
    function asSymbolInformations(values, uri) {
        if (!values) {
            return undefined;
        }
        return values.map(information => asSymbolInformation(information, uri));
    }
    function asSymbolKind(item) {
        if (item <= main$2.SymbolKind.TypeParameter) {
            // Symbol kind is one based in the protocol and zero based in code.
            return item - 1;
        }
        return vscode__default['default'].SymbolKind.Property;
    }
    function asSymbolTag(value) {
        switch (value) {
            case main$2.SymbolTag.Deprecated:
                return vscode__default['default'].SymbolTag.Deprecated;
            default:
                return undefined;
        }
    }
    function asSymbolTags(items) {
        if (items === undefined || items === null) {
            return undefined;
        }
        const result = [];
        for (const item of items) {
            const converted = asSymbolTag(item);
            if (converted !== undefined) {
                result.push(converted);
            }
        }
        return result.length === 0 ? undefined : result;
    }
    function asSymbolInformation(item, uri) {
        // Symbol kind is one based in the protocol and zero based in code.
        let result = new vscode__default['default'].SymbolInformation(item.name, asSymbolKind(item.kind), asRange(item.location.range), item.location.uri ? _uriConverter(item.location.uri) : uri);
        fillTags(result, item);
        if (item.containerName) {
            result.containerName = item.containerName;
        }
        return result;
    }
    function asDocumentSymbols(values) {
        if (values === undefined || values === null) {
            return undefined;
        }
        return values.map(asDocumentSymbol);
    }
    function asDocumentSymbol(value) {
        let result = new vscode__default['default'].DocumentSymbol(value.name, value.detail || '', asSymbolKind(value.kind), asRange(value.range), asRange(value.selectionRange));
        fillTags(result, value);
        if (value.children !== undefined && value.children.length > 0) {
            let children = [];
            for (let child of value.children) {
                children.push(asDocumentSymbol(child));
            }
            result.children = children;
        }
        return result;
    }
    function fillTags(result, value) {
        result.tags = asSymbolTags(value.tags);
        if (value.deprecated) {
            if (!result.tags) {
                result.tags = [vscode__default['default'].SymbolTag.Deprecated];
            }
            else {
                if (!result.tags.includes(vscode__default['default'].SymbolTag.Deprecated)) {
                    result.tags = result.tags.concat(vscode__default['default'].SymbolTag.Deprecated);
                }
            }
        }
    }
    function asCommand(item) {
        let result = { title: item.title, command: item.command };
        if (item.arguments) {
            result.arguments = item.arguments;
        }
        return result;
    }
    function asCommands(items) {
        if (!items) {
            return undefined;
        }
        return items.map(asCommand);
    }
    const kindMapping = new Map();
    kindMapping.set(main$2.CodeActionKind.Empty, vscode__default['default'].CodeActionKind.Empty);
    kindMapping.set(main$2.CodeActionKind.QuickFix, vscode__default['default'].CodeActionKind.QuickFix);
    kindMapping.set(main$2.CodeActionKind.Refactor, vscode__default['default'].CodeActionKind.Refactor);
    kindMapping.set(main$2.CodeActionKind.RefactorExtract, vscode__default['default'].CodeActionKind.RefactorExtract);
    kindMapping.set(main$2.CodeActionKind.RefactorInline, vscode__default['default'].CodeActionKind.RefactorInline);
    kindMapping.set(main$2.CodeActionKind.RefactorRewrite, vscode__default['default'].CodeActionKind.RefactorRewrite);
    kindMapping.set(main$2.CodeActionKind.Source, vscode__default['default'].CodeActionKind.Source);
    kindMapping.set(main$2.CodeActionKind.SourceOrganizeImports, vscode__default['default'].CodeActionKind.SourceOrganizeImports);
    function asCodeActionKind(item) {
        if (item === undefined || item === null) {
            return undefined;
        }
        let result = kindMapping.get(item);
        if (result) {
            return result;
        }
        let parts = item.split('.');
        result = vscode__default['default'].CodeActionKind.Empty;
        for (let part of parts) {
            result = result.append(part);
        }
        return result;
    }
    function asCodeActionKinds(items) {
        if (items === undefined || items === null) {
            return undefined;
        }
        return items.map(kind => asCodeActionKind(kind));
    }
    function asCodeAction(item) {
        if (item === undefined || item === null) {
            return undefined;
        }
        let result = new protocolCodeAction.default(item.title, item.data);
        if (item.kind !== undefined) {
            result.kind = asCodeActionKind(item.kind);
        }
        if (item.diagnostics !== undefined) {
            result.diagnostics = asDiagnostics(item.diagnostics);
        }
        if (item.edit !== undefined) {
            result.edit = asWorkspaceEdit(item.edit);
        }
        if (item.command !== undefined) {
            result.command = asCommand(item.command);
        }
        if (item.isPreferred !== undefined) {
            result.isPreferred = item.isPreferred;
        }
        if (item.disabled !== undefined) {
            result.disabled = { reason: item.disabled.reason };
        }
        return result;
    }
    function asCodeLens(item) {
        if (!item) {
            return undefined;
        }
        let result = new protocolCodeLens.default(asRange(item.range));
        if (item.command) {
            result.command = asCommand(item.command);
        }
        if (item.data !== undefined && item.data !== null) {
            result.data = item.data;
        }
        return result;
    }
    function asCodeLenses(items) {
        if (!items) {
            return undefined;
        }
        return items.map((codeLens) => asCodeLens(codeLens));
    }
    function asWorkspaceEdit(item) {
        if (!item) {
            return undefined;
        }
        const sharedMetadata = new Map();
        if (item.changeAnnotations !== undefined) {
            for (const key of Object.keys(item.changeAnnotations)) {
                const metaData = asWorkspaceEditEntryMetadata(item.changeAnnotations[key]);
                sharedMetadata.set(key, metaData);
            }
        }
        const asMetadata = (annotation) => {
            if (annotation === undefined) {
                return undefined;
            }
            else {
                return sharedMetadata.get(annotation);
            }
        };
        const result = new vscode__default['default'].WorkspaceEdit();
        if (item.documentChanges) {
            for (const change of item.documentChanges) {
                if (main$2.CreateFile.is(change)) {
                    result.createFile(_uriConverter(change.uri), change.options, asMetadata(change.annotationId));
                }
                else if (main$2.RenameFile.is(change)) {
                    result.renameFile(_uriConverter(change.oldUri), _uriConverter(change.newUri), change.options, asMetadata(change.annotationId));
                }
                else if (main$2.DeleteFile.is(change)) {
                    result.deleteFile(_uriConverter(change.uri), change.options, asMetadata(change.annotationId));
                }
                else if (main$2.TextDocumentEdit.is(change)) {
                    const uri = _uriConverter(change.textDocument.uri);
                    for (const edit of change.edits) {
                        if (vscode_languageserver_protocol_1.AnnotatedTextEdit.is(edit)) {
                            result.replace(uri, asRange(edit.range), edit.newText, asMetadata(edit.annotationId));
                        }
                        else {
                            result.replace(uri, asRange(edit.range), edit.newText);
                        }
                    }
                }
                else {
                    throw new Error(`Unknown workspace edit change received:\n${JSON.stringify(change, undefined, 4)}`);
                }
            }
        }
        else if (item.changes) {
            Object.keys(item.changes).forEach(key => {
                result.set(_uriConverter(key), asTextEdits(item.changes[key]));
            });
        }
        return result;
    }
    function asWorkspaceEditEntryMetadata(annotation) {
        if (annotation === undefined) {
            return undefined;
        }
        return { label: annotation.label, needsConfirmation: !!annotation.needsConfirmation, description: annotation.description };
    }
    function asDocumentLink(item) {
        let range = asRange(item.range);
        let target = item.target ? asUri(item.target) : undefined;
        // target must be optional in DocumentLink
        let link = new protocolDocumentLink.default(range, target);
        if (item.tooltip !== undefined) {
            link.tooltip = item.tooltip;
        }
        if (item.data !== undefined && item.data !== null) {
            link.data = item.data;
        }
        return link;
    }
    function asDocumentLinks(items) {
        if (!items) {
            return undefined;
        }
        return items.map(asDocumentLink);
    }
    function asColor(color) {
        return new vscode__default['default'].Color(color.red, color.green, color.blue, color.alpha);
    }
    function asColorInformation(ci) {
        return new vscode__default['default'].ColorInformation(asRange(ci.range), asColor(ci.color));
    }
    function asColorInformations(colorInformation) {
        if (Array.isArray(colorInformation)) {
            return colorInformation.map(asColorInformation);
        }
        return undefined;
    }
    function asColorPresentation(cp) {
        let presentation = new vscode__default['default'].ColorPresentation(cp.label);
        presentation.additionalTextEdits = asTextEdits(cp.additionalTextEdits);
        if (cp.textEdit) {
            presentation.textEdit = asTextEdit(cp.textEdit);
        }
        return presentation;
    }
    function asColorPresentations(colorPresentations) {
        if (Array.isArray(colorPresentations)) {
            return colorPresentations.map(asColorPresentation);
        }
        return undefined;
    }
    function asFoldingRangeKind(kind) {
        if (kind) {
            switch (kind) {
                case main$2.FoldingRangeKind.Comment:
                    return vscode__default['default'].FoldingRangeKind.Comment;
                case main$2.FoldingRangeKind.Imports:
                    return vscode__default['default'].FoldingRangeKind.Imports;
                case main$2.FoldingRangeKind.Region:
                    return vscode__default['default'].FoldingRangeKind.Region;
            }
        }
        return undefined;
    }
    function asFoldingRange(r) {
        return new vscode__default['default'].FoldingRange(r.startLine, r.endLine, asFoldingRangeKind(r.kind));
    }
    function asFoldingRanges(foldingRanges) {
        if (Array.isArray(foldingRanges)) {
            return foldingRanges.map(asFoldingRange);
        }
        return undefined;
    }
    function asSelectionRange(selectionRange) {
        return new vscode__default['default'].SelectionRange(asRange(selectionRange.range), selectionRange.parent ? asSelectionRange(selectionRange.parent) : undefined);
    }
    function asSelectionRanges(selectionRanges) {
        if (!Array.isArray(selectionRanges)) {
            return [];
        }
        let result = [];
        for (let range of selectionRanges) {
            result.push(asSelectionRange(range));
        }
        return result;
    }
    function asCallHierarchyItem(item) {
        if (item === null) {
            return undefined;
        }
        let result = new protocolCallHierarchyItem.default(asSymbolKind(item.kind), item.name, item.detail || '', asUri(item.uri), asRange(item.range), asRange(item.selectionRange), item.data);
        if (item.tags !== undefined) {
            result.tags = asSymbolTags(item.tags);
        }
        return result;
    }
    function asCallHierarchyItems(items) {
        if (items === null) {
            return undefined;
        }
        return items.map(item => asCallHierarchyItem(item));
    }
    function asCallHierarchyIncomingCall(item) {
        return new vscode__default['default'].CallHierarchyIncomingCall(asCallHierarchyItem(item.from), asRanges(item.fromRanges));
    }
    function asCallHierarchyIncomingCalls(items) {
        if (items === null) {
            return undefined;
        }
        return items.map(item => asCallHierarchyIncomingCall(item));
    }
    function asCallHierarchyOutgoingCall(item) {
        return new vscode__default['default'].CallHierarchyOutgoingCall(asCallHierarchyItem(item.to), asRanges(item.fromRanges));
    }
    function asCallHierarchyOutgoingCalls(items) {
        if (items === null) {
            return undefined;
        }
        return items.map(item => asCallHierarchyOutgoingCall(item));
    }
    function asSemanticTokens(value) {
        if (value === undefined || value === null) {
            return undefined;
        }
        return new vscode__default['default'].SemanticTokens(new Uint32Array(value.data), value.resultId);
    }
    function asSemanticTokensEdit(value) {
        return new vscode__default['default'].SemanticTokensEdit(value.start, value.deleteCount, value.data !== undefined ? new Uint32Array(value.data) : undefined);
    }
    function asSemanticTokensEdits(value) {
        if (value === undefined || value === null) {
            return undefined;
        }
        return new vscode__default['default'].SemanticTokensEdits(value.edits.map(asSemanticTokensEdit), value.resultId);
    }
    function asSemanticTokensLegend(value) {
        return value;
    }
    function asLinkedEditingRanges(value) {
        if (value === null || value === undefined) {
            return undefined;
        }
        return new vscode__default['default'].LinkedEditingRanges(asRanges(value.ranges), asRegularExpression(value.wordPattern));
    }
    function asRegularExpression(value) {
        if (value === null || value === undefined) {
            return undefined;
        }
        return new RegExp(value);
    }
    return {
        asUri,
        asDiagnostics,
        asDiagnostic,
        asRange,
        asRanges,
        asPosition,
        asDiagnosticSeverity,
        asDiagnosticTag,
        asHover,
        asCompletionResult,
        asCompletionItem,
        asTextEdit,
        asTextEdits,
        asSignatureHelp,
        asSignatureInformations,
        asSignatureInformation,
        asParameterInformations,
        asParameterInformation,
        asDeclarationResult,
        asDefinitionResult,
        asLocation,
        asReferences,
        asDocumentHighlights,
        asDocumentHighlight,
        asDocumentHighlightKind,
        asSymbolKind,
        asSymbolTag,
        asSymbolTags,
        asSymbolInformations,
        asSymbolInformation,
        asDocumentSymbols,
        asDocumentSymbol,
        asCommand,
        asCommands,
        asCodeAction,
        asCodeActionKind,
        asCodeActionKinds,
        asCodeLens,
        asCodeLenses,
        asWorkspaceEdit,
        asDocumentLink,
        asDocumentLinks,
        asFoldingRangeKind,
        asFoldingRange,
        asFoldingRanges,
        asColor,
        asColorInformation,
        asColorInformations,
        asColorPresentation,
        asColorPresentations,
        asSelectionRange,
        asSelectionRanges,
        asSemanticTokensLegend,
        asSemanticTokens,
        asSemanticTokensEdit,
        asSemanticTokensEdits,
        asCallHierarchyItem,
        asCallHierarchyItems,
        asCallHierarchyIncomingCall,
        asCallHierarchyIncomingCalls,
        asCallHierarchyOutgoingCall,
        asCallHierarchyOutgoingCalls,
        asLinkedEditingRanges: asLinkedEditingRanges
    };
}
exports.createConverter = createConverter;

});

var async = createCommonjsModule(function (module, exports) {
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Delayer = void 0;

class Delayer {
    constructor(defaultDelay) {
        this.defaultDelay = defaultDelay;
        this.timeout = undefined;
        this.completionPromise = undefined;
        this.onSuccess = undefined;
        this.task = undefined;
    }
    trigger(task, delay = this.defaultDelay) {
        this.task = task;
        if (delay >= 0) {
            this.cancelTimeout();
        }
        if (!this.completionPromise) {
            this.completionPromise = new Promise((resolve) => {
                this.onSuccess = resolve;
            }).then(() => {
                this.completionPromise = undefined;
                this.onSuccess = undefined;
                var result = this.task();
                this.task = undefined;
                return result;
            });
        }
        if (delay >= 0 || this.timeout === void 0) {
            this.timeout = main$2.RAL().timer.setTimeout(() => {
                this.timeout = undefined;
                this.onSuccess(undefined);
            }, delay >= 0 ? delay : this.defaultDelay);
        }
        return this.completionPromise;
    }
    forceDelivery() {
        if (!this.completionPromise) {
            return undefined;
        }
        this.cancelTimeout();
        let result = this.task();
        this.completionPromise = undefined;
        this.onSuccess = undefined;
        this.task = undefined;
        return result;
    }
    isTriggered() {
        return this.timeout !== void 0;
    }
    cancel() {
        this.cancelTimeout();
        this.completionPromise = undefined;
    }
    cancelTimeout() {
        if (this.timeout !== void 0) {
            main$2.RAL().timer.clearTimeout(this.timeout);
            this.timeout = undefined;
        }
    }
}
exports.Delayer = Delayer;

});

var uuid = createCommonjsModule(function (module, exports) {
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUuid = exports.parse = exports.isUUID = exports.v4 = exports.empty = void 0;
class ValueUUID {
    constructor(_value) {
        this._value = _value;
        // empty
    }
    asHex() {
        return this._value;
    }
    equals(other) {
        return this.asHex() === other.asHex();
    }
}
class V4UUID extends ValueUUID {
    constructor() {
        super([
            V4UUID._randomHex(),
            V4UUID._randomHex(),
            V4UUID._randomHex(),
            V4UUID._randomHex(),
            V4UUID._randomHex(),
            V4UUID._randomHex(),
            V4UUID._randomHex(),
            V4UUID._randomHex(),
            '-',
            V4UUID._randomHex(),
            V4UUID._randomHex(),
            V4UUID._randomHex(),
            V4UUID._randomHex(),
            '-',
            '4',
            V4UUID._randomHex(),
            V4UUID._randomHex(),
            V4UUID._randomHex(),
            '-',
            V4UUID._oneOf(V4UUID._timeHighBits),
            V4UUID._randomHex(),
            V4UUID._randomHex(),
            V4UUID._randomHex(),
            '-',
            V4UUID._randomHex(),
            V4UUID._randomHex(),
            V4UUID._randomHex(),
            V4UUID._randomHex(),
            V4UUID._randomHex(),
            V4UUID._randomHex(),
            V4UUID._randomHex(),
            V4UUID._randomHex(),
            V4UUID._randomHex(),
            V4UUID._randomHex(),
            V4UUID._randomHex(),
            V4UUID._randomHex(),
        ].join(''));
    }
    static _oneOf(array) {
        return array[Math.floor(array.length * Math.random())];
    }
    static _randomHex() {
        return V4UUID._oneOf(V4UUID._chars);
    }
}
V4UUID._chars = ['0', '1', '2', '3', '4', '5', '6', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];
V4UUID._timeHighBits = ['8', '9', 'a', 'b'];
/**
 * An empty UUID that contains only zeros.
 */
exports.empty = new ValueUUID('00000000-0000-0000-0000-000000000000');
function v4() {
    return new V4UUID();
}
exports.v4 = v4;
const _UUIDPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function isUUID(value) {
    return _UUIDPattern.test(value);
}
exports.isUUID = isUUID;
/**
 * Parses a UUID that is of the format xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.
 * @param value A uuid string.
 */
function parse(value) {
    if (!isUUID(value)) {
        throw new Error('invalid uuid');
    }
    return new ValueUUID(value);
}
exports.parse = parse;
function generateUuid() {
    return v4().asHex();
}
exports.generateUuid = generateUuid;

});

var progressPart = createCommonjsModule(function (module, exports) {
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressPart = void 0;



class ProgressPart {
    constructor(_client, _token, done) {
        this._client = _client;
        this._token = _token;
        this._reported = 0;
        this._disposable = this._client.onProgress(main$2.WorkDoneProgress.type, this._token, (value) => {
            switch (value.kind) {
                case 'begin':
                    this.begin(value);
                    break;
                case 'report':
                    this.report(value);
                    break;
                case 'end':
                    this.done();
                    done && done(this);
                    break;
            }
        });
    }
    begin(params) {
        // Since we don't use commands this will be a silent window progress with a hidden notification.
        vscode__default['default'].window.withProgress({ location: vscode__default['default'].ProgressLocation.Window, cancellable: params.cancellable, title: params.title }, async (progress, cancellationToken) => {
            this._progress = progress;
            this._infinite = params.percentage === undefined;
            this._cancellationToken = cancellationToken;
            this._cancellationToken.onCancellationRequested(() => {
                this._client.sendNotification(main$2.WorkDoneProgressCancelNotification.type, { token: this._token });
            });
            this.report(params);
            return new Promise((resolve, reject) => {
                this._resolve = resolve;
                this._reject = reject;
            });
        });
    }
    report(params) {
        if (this._infinite && is.string(params.message)) {
            this._progress.report({ message: params.message });
        }
        else if (is.number(params.percentage)) {
            let percentage = Math.max(0, Math.min(params.percentage, 100));
            let delta = Math.max(0, percentage - this._reported);
            this._progress.report({ message: params.message, increment: delta });
            this._reported += delta;
        }
    }
    cancel() {
        if (this._disposable) {
            this._disposable.dispose();
            this._disposable = undefined;
        }
        if (this._reject) {
            this._reject();
            this._resolve = undefined;
            this._reject = undefined;
        }
    }
    done() {
        if (this._disposable) {
            this._disposable.dispose();
            this._disposable = undefined;
        }
        if (this._resolve) {
            this._resolve();
            this._resolve = undefined;
            this._reject = undefined;
        }
    }
}
exports.ProgressPart = ProgressPart;

});

var client = createCommonjsModule(function (module, exports) {
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseLanguageClient = exports.MessageTransports = exports.TextDocumentFeature = exports.State = exports.RevealOutputChannelOn = exports.CloseAction = exports.ErrorAction = void 0;









class ConsoleLogger {
    error(message) {
        main$2.RAL().console.error(message);
    }
    warn(message) {
        main$2.RAL().console.warn(message);
    }
    info(message) {
        main$2.RAL().console.info(message);
    }
    log(message) {
        main$2.RAL().console.log(message);
    }
}
function createConnection(input, output, errorHandler, closeHandler, options) {
    let logger = new ConsoleLogger();
    let connection = main$2.createProtocolConnection(input, output, logger, options);
    connection.onError((data) => { errorHandler(data[0], data[1], data[2]); });
    connection.onClose(closeHandler);
    let result = {
        listen: () => connection.listen(),
        sendRequest: (type, ...params) => connection.sendRequest(is.string(type) ? type : type.method, ...params),
        onRequest: (type, handler) => connection.onRequest(is.string(type) ? type : type.method, handler),
        sendNotification: (type, params) => connection.sendNotification(is.string(type) ? type : type.method, params),
        onNotification: (type, handler) => connection.onNotification(is.string(type) ? type : type.method, handler),
        onProgress: connection.onProgress,
        sendProgress: connection.sendProgress,
        trace: (value, tracer, sendNotificationOrTraceOptions) => {
            const defaultTraceOptions = {
                sendNotification: false,
                traceFormat: main$2.TraceFormat.Text
            };
            if (sendNotificationOrTraceOptions === undefined) {
                connection.trace(value, tracer, defaultTraceOptions);
            }
            else if (is.boolean(sendNotificationOrTraceOptions)) {
                connection.trace(value, tracer, sendNotificationOrTraceOptions);
            }
            else {
                connection.trace(value, tracer, sendNotificationOrTraceOptions);
            }
        },
        initialize: (params) => connection.sendRequest(main$2.InitializeRequest.type, params),
        shutdown: () => connection.sendRequest(main$2.ShutdownRequest.type, undefined),
        exit: () => connection.sendNotification(main$2.ExitNotification.type),
        onLogMessage: (handler) => connection.onNotification(main$2.LogMessageNotification.type, handler),
        onShowMessage: (handler) => connection.onNotification(main$2.ShowMessageNotification.type, handler),
        onTelemetry: (handler) => connection.onNotification(main$2.TelemetryEventNotification.type, handler),
        didChangeConfiguration: (params) => connection.sendNotification(main$2.DidChangeConfigurationNotification.type, params),
        didChangeWatchedFiles: (params) => connection.sendNotification(main$2.DidChangeWatchedFilesNotification.type, params),
        didOpenTextDocument: (params) => connection.sendNotification(main$2.DidOpenTextDocumentNotification.type, params),
        didChangeTextDocument: (params) => connection.sendNotification(main$2.DidChangeTextDocumentNotification.type, params),
        didCloseTextDocument: (params) => connection.sendNotification(main$2.DidCloseTextDocumentNotification.type, params),
        didSaveTextDocument: (params) => connection.sendNotification(main$2.DidSaveTextDocumentNotification.type, params),
        onDiagnostics: (handler) => connection.onNotification(main$2.PublishDiagnosticsNotification.type, handler),
        end: () => connection.end(),
        dispose: () => connection.dispose()
    };
    return result;
}
/**
 * An action to be performed when the connection is producing errors.
 */
var ErrorAction;
(function (ErrorAction) {
    /**
     * Continue running the server.
     */
    ErrorAction[ErrorAction["Continue"] = 1] = "Continue";
    /**
     * Shutdown the server.
     */
    ErrorAction[ErrorAction["Shutdown"] = 2] = "Shutdown";
})(ErrorAction = exports.ErrorAction || (exports.ErrorAction = {}));
/**
 * An action to be performed when the connection to a server got closed.
 */
var CloseAction;
(function (CloseAction) {
    /**
     * Don't restart the server. The connection stays closed.
     */
    CloseAction[CloseAction["DoNotRestart"] = 1] = "DoNotRestart";
    /**
     * Restart the server.
     */
    CloseAction[CloseAction["Restart"] = 2] = "Restart";
})(CloseAction = exports.CloseAction || (exports.CloseAction = {}));
class DefaultErrorHandler {
    constructor(name, maxRestartCount) {
        this.name = name;
        this.maxRestartCount = maxRestartCount;
        this.restarts = [];
    }
    error(_error, _message, count) {
        if (count && count <= 3) {
            return ErrorAction.Continue;
        }
        return ErrorAction.Shutdown;
    }
    closed() {
        this.restarts.push(Date.now());
        if (this.restarts.length <= this.maxRestartCount) {
            return CloseAction.Restart;
        }
        else {
            let diff = this.restarts[this.restarts.length - 1] - this.restarts[0];
            if (diff <= 3 * 60 * 1000) {
                vscode__default['default'].window.showErrorMessage(`The ${this.name} server crashed ${this.maxRestartCount + 1} times in the last 3 minutes. The server will not be restarted.`);
                return CloseAction.DoNotRestart;
            }
            else {
                this.restarts.shift();
                return CloseAction.Restart;
            }
        }
    }
}
var RevealOutputChannelOn;
(function (RevealOutputChannelOn) {
    RevealOutputChannelOn[RevealOutputChannelOn["Info"] = 1] = "Info";
    RevealOutputChannelOn[RevealOutputChannelOn["Warn"] = 2] = "Warn";
    RevealOutputChannelOn[RevealOutputChannelOn["Error"] = 3] = "Error";
    RevealOutputChannelOn[RevealOutputChannelOn["Never"] = 4] = "Never";
})(RevealOutputChannelOn = exports.RevealOutputChannelOn || (exports.RevealOutputChannelOn = {}));
var State;
(function (State) {
    State[State["Stopped"] = 1] = "Stopped";
    State[State["Starting"] = 3] = "Starting";
    State[State["Running"] = 2] = "Running";
})(State = exports.State || (exports.State = {}));
var ClientState;
(function (ClientState) {
    ClientState[ClientState["Initial"] = 0] = "Initial";
    ClientState[ClientState["Starting"] = 1] = "Starting";
    ClientState[ClientState["StartFailed"] = 2] = "StartFailed";
    ClientState[ClientState["Running"] = 3] = "Running";
    ClientState[ClientState["Stopping"] = 4] = "Stopping";
    ClientState[ClientState["Stopped"] = 5] = "Stopped";
})(ClientState || (ClientState = {}));
const SupportedSymbolKinds = [
    main$2.SymbolKind.File,
    main$2.SymbolKind.Module,
    main$2.SymbolKind.Namespace,
    main$2.SymbolKind.Package,
    main$2.SymbolKind.Class,
    main$2.SymbolKind.Method,
    main$2.SymbolKind.Property,
    main$2.SymbolKind.Field,
    main$2.SymbolKind.Constructor,
    main$2.SymbolKind.Enum,
    main$2.SymbolKind.Interface,
    main$2.SymbolKind.Function,
    main$2.SymbolKind.Variable,
    main$2.SymbolKind.Constant,
    main$2.SymbolKind.String,
    main$2.SymbolKind.Number,
    main$2.SymbolKind.Boolean,
    main$2.SymbolKind.Array,
    main$2.SymbolKind.Object,
    main$2.SymbolKind.Key,
    main$2.SymbolKind.Null,
    main$2.SymbolKind.EnumMember,
    main$2.SymbolKind.Struct,
    main$2.SymbolKind.Event,
    main$2.SymbolKind.Operator,
    main$2.SymbolKind.TypeParameter
];
const SupportedCompletionItemKinds = [
    main$2.CompletionItemKind.Text,
    main$2.CompletionItemKind.Method,
    main$2.CompletionItemKind.Function,
    main$2.CompletionItemKind.Constructor,
    main$2.CompletionItemKind.Field,
    main$2.CompletionItemKind.Variable,
    main$2.CompletionItemKind.Class,
    main$2.CompletionItemKind.Interface,
    main$2.CompletionItemKind.Module,
    main$2.CompletionItemKind.Property,
    main$2.CompletionItemKind.Unit,
    main$2.CompletionItemKind.Value,
    main$2.CompletionItemKind.Enum,
    main$2.CompletionItemKind.Keyword,
    main$2.CompletionItemKind.Snippet,
    main$2.CompletionItemKind.Color,
    main$2.CompletionItemKind.File,
    main$2.CompletionItemKind.Reference,
    main$2.CompletionItemKind.Folder,
    main$2.CompletionItemKind.EnumMember,
    main$2.CompletionItemKind.Constant,
    main$2.CompletionItemKind.Struct,
    main$2.CompletionItemKind.Event,
    main$2.CompletionItemKind.Operator,
    main$2.CompletionItemKind.TypeParameter
];
const SupportedSymbolTags = [
    main$2.SymbolTag.Deprecated
];
function ensure(target, key) {
    if (target[key] === undefined) {
        target[key] = {};
    }
    return target[key];
}
var FileFormattingOptions;
(function (FileFormattingOptions) {
    function fromConfiguration(document) {
        const filesConfig = vscode__default['default'].workspace.getConfiguration('files', document);
        return {
            trimTrailingWhitespace: filesConfig.get('trimTrailingWhitespace'),
            trimFinalNewlines: filesConfig.get('trimFinalNewlines'),
            insertFinalNewline: filesConfig.get('insertFinalNewline'),
        };
    }
    FileFormattingOptions.fromConfiguration = fromConfiguration;
})(FileFormattingOptions || (FileFormattingOptions = {}));
var DynamicFeature;
(function (DynamicFeature) {
    function is$1(value) {
        let candidate = value;
        return candidate && is.func(candidate.register) && is.func(candidate.unregister) && is.func(candidate.dispose) && candidate.registrationType !== undefined;
    }
    DynamicFeature.is = is$1;
})(DynamicFeature || (DynamicFeature = {}));
class DocumentNotifications {
    constructor(_client, _event, _type, _middleware, _createParams, _selectorFilter) {
        this._client = _client;
        this._event = _event;
        this._type = _type;
        this._middleware = _middleware;
        this._createParams = _createParams;
        this._selectorFilter = _selectorFilter;
        this._selectors = new Map();
    }
    static textDocumentFilter(selectors, textDocument) {
        for (const selector of selectors) {
            if (vscode__default['default'].languages.match(selector, textDocument)) {
                return true;
            }
        }
        return false;
    }
    register(data) {
        if (!data.registerOptions.documentSelector) {
            return;
        }
        if (!this._listener) {
            this._listener = this._event(this.callback, this);
        }
        this._selectors.set(data.id, data.registerOptions.documentSelector);
    }
    callback(data) {
        if (!this._selectorFilter || this._selectorFilter(this._selectors.values(), data)) {
            if (this._middleware) {
                this._middleware(data, (data) => this._client.sendNotification(this._type, this._createParams(data)));
            }
            else {
                this._client.sendNotification(this._type, this._createParams(data));
            }
            this.notificationSent(data);
        }
    }
    notificationSent(_data) {
    }
    unregister(id) {
        this._selectors.delete(id);
        if (this._selectors.size === 0 && this._listener) {
            this._listener.dispose();
            this._listener = undefined;
        }
    }
    dispose() {
        this._selectors.clear();
        if (this._listener) {
            this._listener.dispose();
            this._listener = undefined;
        }
    }
    getProvider(document) {
        for (const selector of this._selectors.values()) {
            if (vscode__default['default'].languages.match(selector, document)) {
                return {
                    send: (data) => {
                        this.callback(data);
                    }
                };
            }
        }
        return undefined;
    }
}
class DidOpenTextDocumentFeature extends DocumentNotifications {
    constructor(client, _syncedDocuments) {
        super(client, vscode__default['default'].workspace.onDidOpenTextDocument, main$2.DidOpenTextDocumentNotification.type, client.clientOptions.middleware.didOpen, (textDocument) => client.code2ProtocolConverter.asOpenTextDocumentParams(textDocument), DocumentNotifications.textDocumentFilter);
        this._syncedDocuments = _syncedDocuments;
    }
    fillClientCapabilities(capabilities) {
        ensure(ensure(capabilities, 'textDocument'), 'synchronization').dynamicRegistration = true;
    }
    initialize(capabilities, documentSelector) {
        let textDocumentSyncOptions = capabilities.resolvedTextDocumentSync;
        if (documentSelector && textDocumentSyncOptions && textDocumentSyncOptions.openClose) {
            this.register({ id: uuid.generateUuid(), registerOptions: { documentSelector: documentSelector } });
        }
    }
    get registrationType() {
        return main$2.DidOpenTextDocumentNotification.type;
    }
    register(data) {
        super.register(data);
        if (!data.registerOptions.documentSelector) {
            return;
        }
        let documentSelector = data.registerOptions.documentSelector;
        vscode__default['default'].workspace.textDocuments.forEach((textDocument) => {
            let uri = textDocument.uri.toString();
            if (this._syncedDocuments.has(uri)) {
                return;
            }
            if (vscode__default['default'].languages.match(documentSelector, textDocument)) {
                let middleware = this._client.clientOptions.middleware;
                let didOpen = (textDocument) => {
                    this._client.sendNotification(this._type, this._createParams(textDocument));
                };
                if (middleware.didOpen) {
                    middleware.didOpen(textDocument, didOpen);
                }
                else {
                    didOpen(textDocument);
                }
                this._syncedDocuments.set(uri, textDocument);
            }
        });
    }
    notificationSent(textDocument) {
        super.notificationSent(textDocument);
        this._syncedDocuments.set(textDocument.uri.toString(), textDocument);
    }
}
class DidCloseTextDocumentFeature extends DocumentNotifications {
    constructor(client, _syncedDocuments) {
        super(client, vscode__default['default'].workspace.onDidCloseTextDocument, main$2.DidCloseTextDocumentNotification.type, client.clientOptions.middleware.didClose, (textDocument) => client.code2ProtocolConverter.asCloseTextDocumentParams(textDocument), DocumentNotifications.textDocumentFilter);
        this._syncedDocuments = _syncedDocuments;
    }
    get registrationType() {
        return main$2.DidCloseTextDocumentNotification.type;
    }
    fillClientCapabilities(capabilities) {
        ensure(ensure(capabilities, 'textDocument'), 'synchronization').dynamicRegistration = true;
    }
    initialize(capabilities, documentSelector) {
        let textDocumentSyncOptions = capabilities.resolvedTextDocumentSync;
        if (documentSelector && textDocumentSyncOptions && textDocumentSyncOptions.openClose) {
            this.register({ id: uuid.generateUuid(), registerOptions: { documentSelector: documentSelector } });
        }
    }
    notificationSent(textDocument) {
        super.notificationSent(textDocument);
        this._syncedDocuments.delete(textDocument.uri.toString());
    }
    unregister(id) {
        let selector = this._selectors.get(id);
        // The super call removed the selector from the map
        // of selectors.
        super.unregister(id);
        let selectors = this._selectors.values();
        this._syncedDocuments.forEach((textDocument) => {
            if (vscode__default['default'].languages.match(selector, textDocument) && !this._selectorFilter(selectors, textDocument)) {
                let middleware = this._client.clientOptions.middleware;
                let didClose = (textDocument) => {
                    this._client.sendNotification(this._type, this._createParams(textDocument));
                };
                this._syncedDocuments.delete(textDocument.uri.toString());
                if (middleware.didClose) {
                    middleware.didClose(textDocument, didClose);
                }
                else {
                    didClose(textDocument);
                }
            }
        });
    }
}
class DidChangeTextDocumentFeature {
    constructor(_client) {
        this._client = _client;
        this._changeData = new Map();
        this._forcingDelivery = false;
    }
    get registrationType() {
        return main$2.DidChangeTextDocumentNotification.type;
    }
    fillClientCapabilities(capabilities) {
        ensure(ensure(capabilities, 'textDocument'), 'synchronization').dynamicRegistration = true;
    }
    initialize(capabilities, documentSelector) {
        let textDocumentSyncOptions = capabilities.resolvedTextDocumentSync;
        if (documentSelector && textDocumentSyncOptions && textDocumentSyncOptions.change !== undefined && textDocumentSyncOptions.change !== main$2.TextDocumentSyncKind.None) {
            this.register({
                id: uuid.generateUuid(),
                registerOptions: Object.assign({}, { documentSelector: documentSelector }, { syncKind: textDocumentSyncOptions.change })
            });
        }
    }
    register(data) {
        if (!data.registerOptions.documentSelector) {
            return;
        }
        if (!this._listener) {
            this._listener = vscode__default['default'].workspace.onDidChangeTextDocument(this.callback, this);
        }
        this._changeData.set(data.id, {
            documentSelector: data.registerOptions.documentSelector,
            syncKind: data.registerOptions.syncKind
        });
    }
    callback(event) {
        // Text document changes are send for dirty changes as well. We don't
        // have dirty / un-dirty events in the LSP so we ignore content changes
        // with length zero.
        if (event.contentChanges.length === 0) {
            return;
        }
        for (const changeData of this._changeData.values()) {
            if (vscode__default['default'].languages.match(changeData.documentSelector, event.document)) {
                let middleware = this._client.clientOptions.middleware;
                if (changeData.syncKind === main$2.TextDocumentSyncKind.Incremental) {
                    let params = this._client.code2ProtocolConverter.asChangeTextDocumentParams(event);
                    if (middleware.didChange) {
                        middleware.didChange(event, () => this._client.sendNotification(main$2.DidChangeTextDocumentNotification.type, params));
                    }
                    else {
                        this._client.sendNotification(main$2.DidChangeTextDocumentNotification.type, params);
                    }
                }
                else if (changeData.syncKind === main$2.TextDocumentSyncKind.Full) {
                    let didChange = (event) => {
                        if (this._changeDelayer) {
                            if (this._changeDelayer.uri !== event.document.uri.toString()) {
                                // Use this force delivery to track boolean state. Otherwise we might call two times.
                                this.forceDelivery();
                                this._changeDelayer.uri = event.document.uri.toString();
                            }
                            this._changeDelayer.delayer.trigger(() => {
                                this._client.sendNotification(main$2.DidChangeTextDocumentNotification.type, this._client.code2ProtocolConverter.asChangeTextDocumentParams(event.document));
                            });
                        }
                        else {
                            this._changeDelayer = {
                                uri: event.document.uri.toString(),
                                delayer: new async.Delayer(200)
                            };
                            this._changeDelayer.delayer.trigger(() => {
                                this._client.sendNotification(main$2.DidChangeTextDocumentNotification.type, this._client.code2ProtocolConverter.asChangeTextDocumentParams(event.document));
                            }, -1);
                        }
                    };
                    if (middleware.didChange) {
                        middleware.didChange(event, didChange);
                    }
                    else {
                        didChange(event);
                    }
                }
            }
        }
    }
    unregister(id) {
        this._changeData.delete(id);
        if (this._changeData.size === 0 && this._listener) {
            this._listener.dispose();
            this._listener = undefined;
        }
    }
    dispose() {
        this._changeDelayer = undefined;
        this._forcingDelivery = false;
        this._changeData.clear();
        if (this._listener) {
            this._listener.dispose();
            this._listener = undefined;
        }
    }
    forceDelivery() {
        if (this._forcingDelivery || !this._changeDelayer) {
            return;
        }
        try {
            this._forcingDelivery = true;
            this._changeDelayer.delayer.forceDelivery();
        }
        finally {
            this._forcingDelivery = false;
        }
    }
    getProvider(document) {
        for (const changeData of this._changeData.values()) {
            if (vscode__default['default'].languages.match(changeData.documentSelector, document)) {
                return {
                    send: (event) => {
                        this.callback(event);
                    }
                };
            }
        }
        return undefined;
    }
}
class WillSaveFeature extends DocumentNotifications {
    constructor(client) {
        super(client, vscode__default['default'].workspace.onWillSaveTextDocument, main$2.WillSaveTextDocumentNotification.type, client.clientOptions.middleware.willSave, (willSaveEvent) => client.code2ProtocolConverter.asWillSaveTextDocumentParams(willSaveEvent), (selectors, willSaveEvent) => DocumentNotifications.textDocumentFilter(selectors, willSaveEvent.document));
    }
    get registrationType() {
        return main$2.WillSaveTextDocumentNotification.type;
    }
    fillClientCapabilities(capabilities) {
        let value = ensure(ensure(capabilities, 'textDocument'), 'synchronization');
        value.willSave = true;
    }
    initialize(capabilities, documentSelector) {
        let textDocumentSyncOptions = capabilities.resolvedTextDocumentSync;
        if (documentSelector && textDocumentSyncOptions && textDocumentSyncOptions.willSave) {
            this.register({
                id: uuid.generateUuid(),
                registerOptions: { documentSelector: documentSelector }
            });
        }
    }
}
class WillSaveWaitUntilFeature {
    constructor(_client) {
        this._client = _client;
        this._selectors = new Map();
    }
    get registrationType() {
        return main$2.WillSaveTextDocumentWaitUntilRequest.type;
    }
    fillClientCapabilities(capabilities) {
        let value = ensure(ensure(capabilities, 'textDocument'), 'synchronization');
        value.willSaveWaitUntil = true;
    }
    initialize(capabilities, documentSelector) {
        let textDocumentSyncOptions = capabilities.resolvedTextDocumentSync;
        if (documentSelector && textDocumentSyncOptions && textDocumentSyncOptions.willSaveWaitUntil) {
            this.register({
                id: uuid.generateUuid(),
                registerOptions: { documentSelector: documentSelector }
            });
        }
    }
    register(data) {
        if (!data.registerOptions.documentSelector) {
            return;
        }
        if (!this._listener) {
            this._listener = vscode__default['default'].workspace.onWillSaveTextDocument(this.callback, this);
        }
        this._selectors.set(data.id, data.registerOptions.documentSelector);
    }
    callback(event) {
        if (DocumentNotifications.textDocumentFilter(this._selectors.values(), event.document)) {
            let middleware = this._client.clientOptions.middleware;
            let willSaveWaitUntil = (event) => {
                return this._client.sendRequest(main$2.WillSaveTextDocumentWaitUntilRequest.type, this._client.code2ProtocolConverter.asWillSaveTextDocumentParams(event)).then((edits) => {
                    let vEdits = this._client.protocol2CodeConverter.asTextEdits(edits);
                    return vEdits === undefined ? [] : vEdits;
                });
            };
            event.waitUntil(middleware.willSaveWaitUntil
                ? middleware.willSaveWaitUntil(event, willSaveWaitUntil)
                : willSaveWaitUntil(event));
        }
    }
    unregister(id) {
        this._selectors.delete(id);
        if (this._selectors.size === 0 && this._listener) {
            this._listener.dispose();
            this._listener = undefined;
        }
    }
    dispose() {
        this._selectors.clear();
        if (this._listener) {
            this._listener.dispose();
            this._listener = undefined;
        }
    }
}
class DidSaveTextDocumentFeature extends DocumentNotifications {
    constructor(client) {
        super(client, vscode__default['default'].workspace.onDidSaveTextDocument, main$2.DidSaveTextDocumentNotification.type, client.clientOptions.middleware.didSave, (textDocument) => client.code2ProtocolConverter.asSaveTextDocumentParams(textDocument, this._includeText), DocumentNotifications.textDocumentFilter);
        this._includeText = false;
    }
    get registrationType() {
        return main$2.DidSaveTextDocumentNotification.type;
    }
    fillClientCapabilities(capabilities) {
        ensure(ensure(capabilities, 'textDocument'), 'synchronization').didSave = true;
    }
    initialize(capabilities, documentSelector) {
        const textDocumentSyncOptions = capabilities.resolvedTextDocumentSync;
        if (documentSelector && textDocumentSyncOptions && textDocumentSyncOptions.save) {
            const saveOptions = typeof textDocumentSyncOptions.save === 'boolean'
                ? { includeText: false }
                : { includeText: !!textDocumentSyncOptions.save.includeText };
            this.register({
                id: uuid.generateUuid(),
                registerOptions: Object.assign({}, { documentSelector: documentSelector }, saveOptions)
            });
        }
    }
    register(data) {
        this._includeText = !!data.registerOptions.includeText;
        super.register(data);
    }
}
class FileSystemWatcherFeature {
    constructor(_client, _notifyFileEvent) {
        this._client = _client;
        this._notifyFileEvent = _notifyFileEvent;
        this._watchers = new Map();
    }
    get registrationType() {
        return main$2.DidChangeWatchedFilesNotification.type;
    }
    fillClientCapabilities(capabilities) {
        ensure(ensure(capabilities, 'workspace'), 'didChangeWatchedFiles').dynamicRegistration = true;
    }
    initialize(_capabilities, _documentSelector) {
    }
    register(data) {
        if (!Array.isArray(data.registerOptions.watchers)) {
            return;
        }
        let disposables = [];
        for (let watcher of data.registerOptions.watchers) {
            if (!is.string(watcher.globPattern)) {
                continue;
            }
            let watchCreate = true, watchChange = true, watchDelete = true;
            if (watcher.kind !== undefined && watcher.kind !== null) {
                watchCreate = (watcher.kind & main$2.WatchKind.Create) !== 0;
                watchChange = (watcher.kind & main$2.WatchKind.Change) !== 0;
                watchDelete = (watcher.kind & main$2.WatchKind.Delete) !== 0;
            }
            let fileSystemWatcher = vscode__default['default'].workspace.createFileSystemWatcher(watcher.globPattern, !watchCreate, !watchChange, !watchDelete);
            this.hookListeners(fileSystemWatcher, watchCreate, watchChange, watchDelete);
            disposables.push(fileSystemWatcher);
        }
        this._watchers.set(data.id, disposables);
    }
    registerRaw(id, fileSystemWatchers) {
        let disposables = [];
        for (let fileSystemWatcher of fileSystemWatchers) {
            this.hookListeners(fileSystemWatcher, true, true, true, disposables);
        }
        this._watchers.set(id, disposables);
    }
    hookListeners(fileSystemWatcher, watchCreate, watchChange, watchDelete, listeners) {
        if (watchCreate) {
            fileSystemWatcher.onDidCreate((resource) => this._notifyFileEvent({
                uri: this._client.code2ProtocolConverter.asUri(resource),
                type: main$2.FileChangeType.Created
            }), null, listeners);
        }
        if (watchChange) {
            fileSystemWatcher.onDidChange((resource) => this._notifyFileEvent({
                uri: this._client.code2ProtocolConverter.asUri(resource),
                type: main$2.FileChangeType.Changed
            }), null, listeners);
        }
        if (watchDelete) {
            fileSystemWatcher.onDidDelete((resource) => this._notifyFileEvent({
                uri: this._client.code2ProtocolConverter.asUri(resource),
                type: main$2.FileChangeType.Deleted
            }), null, listeners);
        }
    }
    unregister(id) {
        let disposables = this._watchers.get(id);
        if (disposables) {
            for (let disposable of disposables) {
                disposable.dispose();
            }
        }
    }
    dispose() {
        this._watchers.forEach((disposables) => {
            for (let disposable of disposables) {
                disposable.dispose();
            }
        });
        this._watchers.clear();
    }
}
class TextDocumentFeature {
    constructor(_client, _registrationType) {
        this._client = _client;
        this._registrationType = _registrationType;
        this._registrations = new Map();
    }
    get registrationType() {
        return this._registrationType;
    }
    register(data) {
        if (!data.registerOptions.documentSelector) {
            return;
        }
        let registration = this.registerLanguageProvider(data.registerOptions);
        this._registrations.set(data.id, { disposable: registration[0], data, provider: registration[1] });
    }
    unregister(id) {
        let registration = this._registrations.get(id);
        if (registration !== undefined) {
            registration.disposable.dispose();
        }
    }
    dispose() {
        this._registrations.forEach((value) => {
            value.disposable.dispose();
        });
        this._registrations.clear();
    }
    getRegistration(documentSelector, capability) {
        if (!capability) {
            return [undefined, undefined];
        }
        else if (main$2.TextDocumentRegistrationOptions.is(capability)) {
            const id = main$2.StaticRegistrationOptions.hasId(capability) ? capability.id : uuid.generateUuid();
            const selector = capability.documentSelector || documentSelector;
            if (selector) {
                return [id, Object.assign({}, capability, { documentSelector: selector })];
            }
        }
        else if (is.boolean(capability) && capability === true || main$2.WorkDoneProgressOptions.is(capability)) {
            if (!documentSelector) {
                return [undefined, undefined];
            }
            let options = (is.boolean(capability) && capability === true ? { documentSelector } : Object.assign({}, capability, { documentSelector }));
            return [uuid.generateUuid(), options];
        }
        return [undefined, undefined];
    }
    getRegistrationOptions(documentSelector, capability) {
        if (!documentSelector || !capability) {
            return undefined;
        }
        return (is.boolean(capability) && capability === true ? { documentSelector } : Object.assign({}, capability, { documentSelector }));
    }
    getProvider(textDocument) {
        for (const registration of this._registrations.values()) {
            let selector = registration.data.registerOptions.documentSelector;
            if (selector !== null && vscode__default['default'].languages.match(selector, textDocument)) {
                return registration.provider;
            }
        }
        return undefined;
    }
    getAllProviders() {
        const result = [];
        for (const item of this._registrations.values()) {
            result.push(item.provider);
        }
        return result;
    }
}
exports.TextDocumentFeature = TextDocumentFeature;
class WorkspaceFeature {
    constructor(_client, _registrationType) {
        this._client = _client;
        this._registrationType = _registrationType;
        this._registrations = new Map();
    }
    get registrationType() {
        return this._registrationType;
    }
    register(data) {
        const registration = this.registerLanguageProvider(data.registerOptions);
        this._registrations.set(data.id, { disposable: registration[0], provider: registration[1] });
    }
    unregister(id) {
        let registration = this._registrations.get(id);
        if (registration !== undefined) {
            registration.disposable.dispose();
        }
    }
    dispose() {
        this._registrations.forEach((registration) => {
            registration.disposable.dispose();
        });
        this._registrations.clear();
    }
    getProviders() {
        const result = [];
        for (const registration of this._registrations.values()) {
            result.push(registration.provider);
        }
        return result;
    }
}
class CompletionItemFeature extends TextDocumentFeature {
    constructor(client) {
        super(client, main$2.CompletionRequest.type);
    }
    fillClientCapabilities(capabilities) {
        let completion = ensure(ensure(capabilities, 'textDocument'), 'completion');
        completion.dynamicRegistration = true;
        completion.contextSupport = true;
        completion.completionItem = {
            snippetSupport: true,
            commitCharactersSupport: true,
            documentationFormat: [main$2.MarkupKind.Markdown, main$2.MarkupKind.PlainText],
            deprecatedSupport: true,
            preselectSupport: true,
            tagSupport: { valueSet: [main$2.CompletionItemTag.Deprecated] },
            insertReplaceSupport: true,
            resolveSupport: {
                properties: ['documentation', 'detail', 'additionalTextEdits']
            },
            insertTextModeSupport: { valueSet: [main$2.InsertTextMode.asIs, main$2.InsertTextMode.adjustIndentation] }
        };
        completion.completionItemKind = { valueSet: SupportedCompletionItemKinds };
    }
    initialize(capabilities, documentSelector) {
        const options = this.getRegistrationOptions(documentSelector, capabilities.completionProvider);
        if (!options) {
            return;
        }
        this.register({
            id: uuid.generateUuid(),
            registerOptions: options
        });
    }
    registerLanguageProvider(options) {
        const triggerCharacters = options.triggerCharacters || [];
        const provider = {
            provideCompletionItems: (document, position, token, context) => {
                const client = this._client;
                const middleware = this._client.clientOptions.middleware;
                const provideCompletionItems = (document, position, context, token) => {
                    return client.sendRequest(main$2.CompletionRequest.type, client.code2ProtocolConverter.asCompletionParams(document, position, context), token).then(client.protocol2CodeConverter.asCompletionResult, (error) => {
                        return client.handleFailedRequest(main$2.CompletionRequest.type, error, null);
                    });
                };
                return middleware.provideCompletionItem
                    ? middleware.provideCompletionItem(document, position, context, token, provideCompletionItems)
                    : provideCompletionItems(document, position, context, token);
            },
            resolveCompletionItem: options.resolveProvider
                ? (item, token) => {
                    const client = this._client;
                    const middleware = this._client.clientOptions.middleware;
                    const resolveCompletionItem = (item, token) => {
                        return client.sendRequest(main$2.CompletionResolveRequest.type, client.code2ProtocolConverter.asCompletionItem(item), token).then(client.protocol2CodeConverter.asCompletionItem, (error) => {
                            return client.handleFailedRequest(main$2.CompletionResolveRequest.type, error, item);
                        });
                    };
                    return middleware.resolveCompletionItem
                        ? middleware.resolveCompletionItem(item, token, resolveCompletionItem)
                        : resolveCompletionItem(item, token);
                }
                : undefined
        };
        return [vscode__default['default'].languages.registerCompletionItemProvider(options.documentSelector, provider, ...triggerCharacters), provider];
    }
}
class HoverFeature extends TextDocumentFeature {
    constructor(client) {
        super(client, main$2.HoverRequest.type);
    }
    fillClientCapabilities(capabilities) {
        const hoverCapability = (ensure(ensure(capabilities, 'textDocument'), 'hover'));
        hoverCapability.dynamicRegistration = true;
        hoverCapability.contentFormat = [main$2.MarkupKind.Markdown, main$2.MarkupKind.PlainText];
    }
    initialize(capabilities, documentSelector) {
        const options = this.getRegistrationOptions(documentSelector, capabilities.hoverProvider);
        if (!options) {
            return;
        }
        this.register({
            id: uuid.generateUuid(),
            registerOptions: options
        });
    }
    registerLanguageProvider(options) {
        const provider = {
            provideHover: (document, position, token) => {
                const client = this._client;
                const provideHover = (document, position, token) => {
                    return client.sendRequest(main$2.HoverRequest.type, client.code2ProtocolConverter.asTextDocumentPositionParams(document, position), token).then(client.protocol2CodeConverter.asHover, (error) => {
                        return client.handleFailedRequest(main$2.HoverRequest.type, error, null);
                    });
                };
                const middleware = client.clientOptions.middleware;
                return middleware.provideHover
                    ? middleware.provideHover(document, position, token, provideHover)
                    : provideHover(document, position, token);
            }
        };
        return [vscode__default['default'].languages.registerHoverProvider(options.documentSelector, provider), provider];
    }
}
class SignatureHelpFeature extends TextDocumentFeature {
    constructor(client) {
        super(client, main$2.SignatureHelpRequest.type);
    }
    fillClientCapabilities(capabilities) {
        let config = ensure(ensure(capabilities, 'textDocument'), 'signatureHelp');
        config.dynamicRegistration = true;
        config.signatureInformation = { documentationFormat: [main$2.MarkupKind.Markdown, main$2.MarkupKind.PlainText] };
        config.signatureInformation.parameterInformation = { labelOffsetSupport: true };
        config.signatureInformation.activeParameterSupport = true;
        config.contextSupport = true;
    }
    initialize(capabilities, documentSelector) {
        const options = this.getRegistrationOptions(documentSelector, capabilities.signatureHelpProvider);
        if (!options) {
            return;
        }
        this.register({
            id: uuid.generateUuid(),
            registerOptions: options
        });
    }
    registerLanguageProvider(options) {
        const provider = {
            provideSignatureHelp: (document, position, token, context) => {
                const client = this._client;
                const providerSignatureHelp = (document, position, context, token) => {
                    return client.sendRequest(main$2.SignatureHelpRequest.type, client.code2ProtocolConverter.asSignatureHelpParams(document, position, context), token).then(client.protocol2CodeConverter.asSignatureHelp, (error) => {
                        return client.handleFailedRequest(main$2.SignatureHelpRequest.type, error, null);
                    });
                };
                const middleware = client.clientOptions.middleware;
                return middleware.provideSignatureHelp
                    ? middleware.provideSignatureHelp(document, position, context, token, providerSignatureHelp)
                    : providerSignatureHelp(document, position, context, token);
            }
        };
        let disposable;
        if (options.retriggerCharacters === undefined) {
            const triggerCharacters = options.triggerCharacters || [];
            disposable = vscode__default['default'].languages.registerSignatureHelpProvider(options.documentSelector, provider, ...triggerCharacters);
        }
        else {
            const metaData = {
                triggerCharacters: options.triggerCharacters || [],
                retriggerCharacters: options.retriggerCharacters || []
            };
            disposable = vscode__default['default'].languages.registerSignatureHelpProvider(options.documentSelector, provider, metaData);
        }
        return [disposable, provider];
    }
}
class DefinitionFeature extends TextDocumentFeature {
    constructor(client) {
        super(client, main$2.DefinitionRequest.type);
    }
    fillClientCapabilities(capabilities) {
        let definitionSupport = ensure(ensure(capabilities, 'textDocument'), 'definition');
        definitionSupport.dynamicRegistration = true;
        definitionSupport.linkSupport = true;
    }
    initialize(capabilities, documentSelector) {
        const options = this.getRegistrationOptions(documentSelector, capabilities.definitionProvider);
        if (!options) {
            return;
        }
        this.register({ id: uuid.generateUuid(), registerOptions: options });
    }
    registerLanguageProvider(options) {
        const provider = {
            provideDefinition: (document, position, token) => {
                const client = this._client;
                const provideDefinition = (document, position, token) => {
                    return client.sendRequest(main$2.DefinitionRequest.type, client.code2ProtocolConverter.asTextDocumentPositionParams(document, position), token).then(client.protocol2CodeConverter.asDefinitionResult, (error) => {
                        return client.handleFailedRequest(main$2.DefinitionRequest.type, error, null);
                    });
                };
                const middleware = client.clientOptions.middleware;
                return middleware.provideDefinition
                    ? middleware.provideDefinition(document, position, token, provideDefinition)
                    : provideDefinition(document, position, token);
            }
        };
        return [vscode__default['default'].languages.registerDefinitionProvider(options.documentSelector, provider), provider];
    }
}
class ReferencesFeature extends TextDocumentFeature {
    constructor(client) {
        super(client, main$2.ReferencesRequest.type);
    }
    fillClientCapabilities(capabilities) {
        ensure(ensure(capabilities, 'textDocument'), 'references').dynamicRegistration = true;
    }
    initialize(capabilities, documentSelector) {
        const options = this.getRegistrationOptions(documentSelector, capabilities.referencesProvider);
        if (!options) {
            return;
        }
        this.register({ id: uuid.generateUuid(), registerOptions: options });
    }
    registerLanguageProvider(options) {
        const provider = {
            provideReferences: (document, position, options, token) => {
                const client = this._client;
                const _providerReferences = (document, position, options, token) => {
                    return client.sendRequest(main$2.ReferencesRequest.type, client.code2ProtocolConverter.asReferenceParams(document, position, options), token).then(client.protocol2CodeConverter.asReferences, (error) => {
                        return client.handleFailedRequest(main$2.ReferencesRequest.type, error, null);
                    });
                };
                const middleware = client.clientOptions.middleware;
                return middleware.provideReferences
                    ? middleware.provideReferences(document, position, options, token, _providerReferences)
                    : _providerReferences(document, position, options, token);
            }
        };
        return [vscode__default['default'].languages.registerReferenceProvider(options.documentSelector, provider), provider];
    }
}
class DocumentHighlightFeature extends TextDocumentFeature {
    constructor(client) {
        super(client, main$2.DocumentHighlightRequest.type);
    }
    fillClientCapabilities(capabilities) {
        ensure(ensure(capabilities, 'textDocument'), 'documentHighlight').dynamicRegistration = true;
    }
    initialize(capabilities, documentSelector) {
        const options = this.getRegistrationOptions(documentSelector, capabilities.documentHighlightProvider);
        if (!options) {
            return;
        }
        this.register({ id: uuid.generateUuid(), registerOptions: options });
    }
    registerLanguageProvider(options) {
        const provider = {
            provideDocumentHighlights: (document, position, token) => {
                const client = this._client;
                const _provideDocumentHighlights = (document, position, token) => {
                    return client.sendRequest(main$2.DocumentHighlightRequest.type, client.code2ProtocolConverter.asTextDocumentPositionParams(document, position), token).then(client.protocol2CodeConverter.asDocumentHighlights, (error) => {
                        return client.handleFailedRequest(main$2.DocumentHighlightRequest.type, error, null);
                    });
                };
                const middleware = client.clientOptions.middleware;
                return middleware.provideDocumentHighlights
                    ? middleware.provideDocumentHighlights(document, position, token, _provideDocumentHighlights)
                    : _provideDocumentHighlights(document, position, token);
            }
        };
        return [vscode__default['default'].languages.registerDocumentHighlightProvider(options.documentSelector, provider), provider];
    }
}
class DocumentSymbolFeature extends TextDocumentFeature {
    constructor(client) {
        super(client, main$2.DocumentSymbolRequest.type);
    }
    fillClientCapabilities(capabilities) {
        let symbolCapabilities = ensure(ensure(capabilities, 'textDocument'), 'documentSymbol');
        symbolCapabilities.dynamicRegistration = true;
        symbolCapabilities.symbolKind = {
            valueSet: SupportedSymbolKinds
        };
        symbolCapabilities.hierarchicalDocumentSymbolSupport = true;
        symbolCapabilities.tagSupport = {
            valueSet: SupportedSymbolTags
        };
        symbolCapabilities.labelSupport = true;
    }
    initialize(capabilities, documentSelector) {
        const options = this.getRegistrationOptions(documentSelector, capabilities.documentSymbolProvider);
        if (!options) {
            return;
        }
        this.register({ id: uuid.generateUuid(), registerOptions: options });
    }
    registerLanguageProvider(options) {
        const provider = {
            provideDocumentSymbols: (document, token) => {
                const client = this._client;
                const _provideDocumentSymbols = (document, token) => {
                    return client.sendRequest(main$2.DocumentSymbolRequest.type, client.code2ProtocolConverter.asDocumentSymbolParams(document), token).then((data) => {
                        if (data === null) {
                            return undefined;
                        }
                        if (data.length === 0) {
                            return [];
                        }
                        else {
                            let element = data[0];
                            if (main$2.DocumentSymbol.is(element)) {
                                return client.protocol2CodeConverter.asDocumentSymbols(data);
                            }
                            else {
                                return client.protocol2CodeConverter.asSymbolInformations(data);
                            }
                        }
                    }, (error) => {
                        return client.handleFailedRequest(main$2.DocumentSymbolRequest.type, error, null);
                    });
                };
                const middleware = client.clientOptions.middleware;
                return middleware.provideDocumentSymbols
                    ? middleware.provideDocumentSymbols(document, token, _provideDocumentSymbols)
                    : _provideDocumentSymbols(document, token);
            }
        };
        const metaData = options.label !== undefined ? { label: options.label } : undefined;
        return [vscode__default['default'].languages.registerDocumentSymbolProvider(options.documentSelector, provider, metaData), provider];
    }
}
class WorkspaceSymbolFeature extends WorkspaceFeature {
    constructor(client) {
        super(client, main$2.WorkspaceSymbolRequest.type);
    }
    fillClientCapabilities(capabilities) {
        let symbolCapabilities = ensure(ensure(capabilities, 'workspace'), 'symbol');
        symbolCapabilities.dynamicRegistration = true;
        symbolCapabilities.symbolKind = {
            valueSet: SupportedSymbolKinds
        };
        symbolCapabilities.tagSupport = {
            valueSet: SupportedSymbolTags
        };
    }
    initialize(capabilities) {
        if (!capabilities.workspaceSymbolProvider) {
            return;
        }
        this.register({
            id: uuid.generateUuid(),
            registerOptions: capabilities.workspaceSymbolProvider === true ? { workDoneProgress: false } : capabilities.workspaceSymbolProvider
        });
    }
    registerLanguageProvider(_options) {
        const provider = {
            provideWorkspaceSymbols: (query, token) => {
                const client = this._client;
                const provideWorkspaceSymbols = (query, token) => {
                    return client.sendRequest(main$2.WorkspaceSymbolRequest.type, { query }, token).then(client.protocol2CodeConverter.asSymbolInformations, (error) => {
                        return client.handleFailedRequest(main$2.WorkspaceSymbolRequest.type, error, null);
                    });
                };
                const middleware = client.clientOptions.middleware;
                return middleware.provideWorkspaceSymbols
                    ? middleware.provideWorkspaceSymbols(query, token, provideWorkspaceSymbols)
                    : provideWorkspaceSymbols(query, token);
            }
        };
        return [vscode__default['default'].languages.registerWorkspaceSymbolProvider(provider), provider];
    }
}
class CodeActionFeature extends TextDocumentFeature {
    constructor(client) {
        super(client, main$2.CodeActionRequest.type);
    }
    fillClientCapabilities(capabilities) {
        const cap = ensure(ensure(capabilities, 'textDocument'), 'codeAction');
        cap.dynamicRegistration = true;
        cap.isPreferredSupport = true;
        cap.disabledSupport = true;
        cap.dataSupport = true;
        // We can only resolve the edit property.
        cap.resolveSupport = {
            properties: ['edit']
        };
        cap.codeActionLiteralSupport = {
            codeActionKind: {
                valueSet: [
                    main$2.CodeActionKind.Empty,
                    main$2.CodeActionKind.QuickFix,
                    main$2.CodeActionKind.Refactor,
                    main$2.CodeActionKind.RefactorExtract,
                    main$2.CodeActionKind.RefactorInline,
                    main$2.CodeActionKind.RefactorRewrite,
                    main$2.CodeActionKind.Source,
                    main$2.CodeActionKind.SourceOrganizeImports
                ]
            }
        };
        cap.honorsChangeAnnotations = false;
    }
    initialize(capabilities, documentSelector) {
        const options = this.getRegistrationOptions(documentSelector, capabilities.codeActionProvider);
        if (!options) {
            return;
        }
        this.register({ id: uuid.generateUuid(), registerOptions: options });
    }
    registerLanguageProvider(options) {
        const provider = {
            provideCodeActions: (document, range, context, token) => {
                const client = this._client;
                const _provideCodeActions = (document, range, context, token) => {
                    const params = {
                        textDocument: client.code2ProtocolConverter.asTextDocumentIdentifier(document),
                        range: client.code2ProtocolConverter.asRange(range),
                        context: client.code2ProtocolConverter.asCodeActionContext(context)
                    };
                    return client.sendRequest(main$2.CodeActionRequest.type, params, token).then((values) => {
                        if (values === null) {
                            return undefined;
                        }
                        const result = [];
                        for (let item of values) {
                            if (main$2.Command.is(item)) {
                                result.push(client.protocol2CodeConverter.asCommand(item));
                            }
                            else {
                                result.push(client.protocol2CodeConverter.asCodeAction(item));
                            }
                        }
                        return result;
                    }, (error) => {
                        return client.handleFailedRequest(main$2.CodeActionRequest.type, error, null);
                    });
                };
                const middleware = client.clientOptions.middleware;
                return middleware.provideCodeActions
                    ? middleware.provideCodeActions(document, range, context, token, _provideCodeActions)
                    : _provideCodeActions(document, range, context, token);
            },
            resolveCodeAction: options.resolveProvider
                ? (item, token) => {
                    const client = this._client;
                    const middleware = this._client.clientOptions.middleware;
                    const resolveCodeAction = (item, token) => {
                        return client.sendRequest(main$2.CodeActionResolveRequest.type, client.code2ProtocolConverter.asCodeAction(item), token).then(client.protocol2CodeConverter.asCodeAction, (error) => {
                            return client.handleFailedRequest(main$2.CodeActionResolveRequest.type, error, item);
                        });
                    };
                    return middleware.resolveCodeAction
                        ? middleware.resolveCodeAction(item, token, resolveCodeAction)
                        : resolveCodeAction(item, token);
                }
                : undefined
        };
        return [vscode__default['default'].languages.registerCodeActionsProvider(options.documentSelector, provider, (options.codeActionKinds
                ? { providedCodeActionKinds: this._client.protocol2CodeConverter.asCodeActionKinds(options.codeActionKinds) }
                : undefined)), provider];
    }
}
class CodeLensFeature extends TextDocumentFeature {
    constructor(client) {
        super(client, main$2.CodeLensRequest.type);
    }
    fillClientCapabilities(capabilities) {
        ensure(ensure(capabilities, 'textDocument'), 'codeLens').dynamicRegistration = true;
        ensure(ensure(capabilities, 'workspace'), 'codeLens').refreshSupport = true;
    }
    initialize(capabilities, documentSelector) {
        const client = this._client;
        client.onRequest(main$2.CodeLensRefreshRequest.type, async () => {
            for (const provider of this.getAllProviders()) {
                provider.onDidChangeCodeLensEmitter.fire();
            }
        });
        const options = this.getRegistrationOptions(documentSelector, capabilities.codeLensProvider);
        if (!options) {
            return;
        }
        this.register({ id: uuid.generateUuid(), registerOptions: options });
    }
    registerLanguageProvider(options) {
        const eventEmitter = new vscode__default['default'].EventEmitter();
        const provider = {
            onDidChangeCodeLenses: eventEmitter.event,
            provideCodeLenses: (document, token) => {
                const client = this._client;
                const provideCodeLenses = (document, token) => {
                    return client.sendRequest(main$2.CodeLensRequest.type, client.code2ProtocolConverter.asCodeLensParams(document), token).then(client.protocol2CodeConverter.asCodeLenses, (error) => {
                        return client.handleFailedRequest(main$2.CodeLensRequest.type, error, null);
                    });
                };
                const middleware = client.clientOptions.middleware;
                return middleware.provideCodeLenses
                    ? middleware.provideCodeLenses(document, token, provideCodeLenses)
                    : provideCodeLenses(document, token);
            },
            resolveCodeLens: (options.resolveProvider)
                ? (codeLens, token) => {
                    const client = this._client;
                    const resolveCodeLens = (codeLens, token) => {
                        return client.sendRequest(main$2.CodeLensResolveRequest.type, client.code2ProtocolConverter.asCodeLens(codeLens), token).then(client.protocol2CodeConverter.asCodeLens, (error) => {
                            return client.handleFailedRequest(main$2.CodeLensResolveRequest.type, error, codeLens);
                        });
                    };
                    const middleware = client.clientOptions.middleware;
                    return middleware.resolveCodeLens
                        ? middleware.resolveCodeLens(codeLens, token, resolveCodeLens)
                        : resolveCodeLens(codeLens, token);
                }
                : undefined
        };
        return [vscode__default['default'].languages.registerCodeLensProvider(options.documentSelector, provider), { provider, onDidChangeCodeLensEmitter: eventEmitter }];
    }
}
class DocumentFormattingFeature extends TextDocumentFeature {
    constructor(client) {
        super(client, main$2.DocumentFormattingRequest.type);
    }
    fillClientCapabilities(capabilities) {
        ensure(ensure(capabilities, 'textDocument'), 'formatting').dynamicRegistration = true;
    }
    initialize(capabilities, documentSelector) {
        const options = this.getRegistrationOptions(documentSelector, capabilities.documentFormattingProvider);
        if (!options) {
            return;
        }
        this.register({ id: uuid.generateUuid(), registerOptions: options });
    }
    registerLanguageProvider(options) {
        const provider = {
            provideDocumentFormattingEdits: (document, options, token) => {
                const client = this._client;
                const provideDocumentFormattingEdits = (document, options, token) => {
                    const params = {
                        textDocument: client.code2ProtocolConverter.asTextDocumentIdentifier(document),
                        options: client.code2ProtocolConverter.asFormattingOptions(options, FileFormattingOptions.fromConfiguration(document))
                    };
                    return client.sendRequest(main$2.DocumentFormattingRequest.type, params, token).then(client.protocol2CodeConverter.asTextEdits, (error) => {
                        return client.handleFailedRequest(main$2.DocumentFormattingRequest.type, error, null);
                    });
                };
                const middleware = client.clientOptions.middleware;
                return middleware.provideDocumentFormattingEdits
                    ? middleware.provideDocumentFormattingEdits(document, options, token, provideDocumentFormattingEdits)
                    : provideDocumentFormattingEdits(document, options, token);
            }
        };
        return [vscode__default['default'].languages.registerDocumentFormattingEditProvider(options.documentSelector, provider), provider];
    }
}
class DocumentRangeFormattingFeature extends TextDocumentFeature {
    constructor(client) {
        super(client, main$2.DocumentRangeFormattingRequest.type);
    }
    fillClientCapabilities(capabilities) {
        ensure(ensure(capabilities, 'textDocument'), 'rangeFormatting').dynamicRegistration = true;
    }
    initialize(capabilities, documentSelector) {
        const options = this.getRegistrationOptions(documentSelector, capabilities.documentRangeFormattingProvider);
        if (!options) {
            return;
        }
        this.register({ id: uuid.generateUuid(), registerOptions: options });
    }
    registerLanguageProvider(options) {
        const provider = {
            provideDocumentRangeFormattingEdits: (document, range, options, token) => {
                const client = this._client;
                const provideDocumentRangeFormattingEdits = (document, range, options, token) => {
                    const params = {
                        textDocument: client.code2ProtocolConverter.asTextDocumentIdentifier(document),
                        range: client.code2ProtocolConverter.asRange(range),
                        options: client.code2ProtocolConverter.asFormattingOptions(options, FileFormattingOptions.fromConfiguration(document))
                    };
                    return client.sendRequest(main$2.DocumentRangeFormattingRequest.type, params, token).then(client.protocol2CodeConverter.asTextEdits, (error) => {
                        return client.handleFailedRequest(main$2.DocumentRangeFormattingRequest.type, error, null);
                    });
                };
                const middleware = client.clientOptions.middleware;
                return middleware.provideDocumentRangeFormattingEdits
                    ? middleware.provideDocumentRangeFormattingEdits(document, range, options, token, provideDocumentRangeFormattingEdits)
                    : provideDocumentRangeFormattingEdits(document, range, options, token);
            }
        };
        return [vscode__default['default'].languages.registerDocumentRangeFormattingEditProvider(options.documentSelector, provider), provider];
    }
}
class DocumentOnTypeFormattingFeature extends TextDocumentFeature {
    constructor(client) {
        super(client, main$2.DocumentOnTypeFormattingRequest.type);
    }
    fillClientCapabilities(capabilities) {
        ensure(ensure(capabilities, 'textDocument'), 'onTypeFormatting').dynamicRegistration = true;
    }
    initialize(capabilities, documentSelector) {
        const options = this.getRegistrationOptions(documentSelector, capabilities.documentOnTypeFormattingProvider);
        if (!options) {
            return;
        }
        this.register({ id: uuid.generateUuid(), registerOptions: options });
    }
    registerLanguageProvider(options) {
        const provider = {
            provideOnTypeFormattingEdits: (document, position, ch, options, token) => {
                const client = this._client;
                const provideOnTypeFormattingEdits = (document, position, ch, options, token) => {
                    let params = {
                        textDocument: client.code2ProtocolConverter.asTextDocumentIdentifier(document),
                        position: client.code2ProtocolConverter.asPosition(position),
                        ch: ch,
                        options: client.code2ProtocolConverter.asFormattingOptions(options, FileFormattingOptions.fromConfiguration(document))
                    };
                    return client.sendRequest(main$2.DocumentOnTypeFormattingRequest.type, params, token).then(client.protocol2CodeConverter.asTextEdits, (error) => {
                        return client.handleFailedRequest(main$2.DocumentOnTypeFormattingRequest.type, error, null);
                    });
                };
                const middleware = client.clientOptions.middleware;
                return middleware.provideOnTypeFormattingEdits
                    ? middleware.provideOnTypeFormattingEdits(document, position, ch, options, token, provideOnTypeFormattingEdits)
                    : provideOnTypeFormattingEdits(document, position, ch, options, token);
            }
        };
        const moreTriggerCharacter = options.moreTriggerCharacter || [];
        return [vscode__default['default'].languages.registerOnTypeFormattingEditProvider(options.documentSelector, provider, options.firstTriggerCharacter, ...moreTriggerCharacter), provider];
    }
}
class RenameFeature extends TextDocumentFeature {
    constructor(client) {
        super(client, main$2.RenameRequest.type);
    }
    fillClientCapabilities(capabilities) {
        let rename = ensure(ensure(capabilities, 'textDocument'), 'rename');
        rename.dynamicRegistration = true;
        rename.prepareSupport = true;
        rename.prepareSupportDefaultBehavior = main$2.PrepareSupportDefaultBehavior.Identifier;
        rename.honorsChangeAnnotations = true;
    }
    initialize(capabilities, documentSelector) {
        const options = this.getRegistrationOptions(documentSelector, capabilities.renameProvider);
        if (!options) {
            return;
        }
        if (is.boolean(capabilities.renameProvider)) {
            options.prepareProvider = false;
        }
        this.register({ id: uuid.generateUuid(), registerOptions: options });
    }
    registerLanguageProvider(options) {
        const provider = {
            provideRenameEdits: (document, position, newName, token) => {
                const client = this._client;
                const provideRenameEdits = (document, position, newName, token) => {
                    let params = {
                        textDocument: client.code2ProtocolConverter.asTextDocumentIdentifier(document),
                        position: client.code2ProtocolConverter.asPosition(position),
                        newName: newName
                    };
                    return client.sendRequest(main$2.RenameRequest.type, params, token).then(client.protocol2CodeConverter.asWorkspaceEdit, (error) => {
                        return client.handleFailedRequest(main$2.RenameRequest.type, error, null);
                    });
                };
                const middleware = client.clientOptions.middleware;
                return middleware.provideRenameEdits
                    ? middleware.provideRenameEdits(document, position, newName, token, provideRenameEdits)
                    : provideRenameEdits(document, position, newName, token);
            },
            prepareRename: options.prepareProvider
                ? (document, position, token) => {
                    const client = this._client;
                    const prepareRename = (document, position, token) => {
                        let params = {
                            textDocument: client.code2ProtocolConverter.asTextDocumentIdentifier(document),
                            position: client.code2ProtocolConverter.asPosition(position),
                        };
                        return client.sendRequest(main$2.PrepareRenameRequest.type, params, token).then((result) => {
                            if (main$2.Range.is(result)) {
                                return client.protocol2CodeConverter.asRange(result);
                            }
                            else if (this.isDefaultBehavior(result)) {
                                return result.defaultBehavior === true
                                    ? null
                                    : Promise.reject(new Error(`The element can't be renamed.`));
                            }
                            else if (result && main$2.Range.is(result.range)) {
                                return {
                                    range: client.protocol2CodeConverter.asRange(result.range),
                                    placeholder: result.placeholder
                                };
                            }
                            // To cancel the rename vscode API expects a rejected promise.
                            return Promise.reject(new Error(`The element can't be renamed.`));
                        }, (error) => {
                            return client.handleFailedRequest(main$2.PrepareRenameRequest.type, error, undefined);
                        });
                    };
                    const middleware = client.clientOptions.middleware;
                    return middleware.prepareRename
                        ? middleware.prepareRename(document, position, token, prepareRename)
                        : prepareRename(document, position, token);
                }
                : undefined
        };
        return [vscode__default['default'].languages.registerRenameProvider(options.documentSelector, provider), provider];
    }
    isDefaultBehavior(value) {
        const candidate = value;
        return candidate && is.boolean(candidate.defaultBehavior);
    }
}
class DocumentLinkFeature extends TextDocumentFeature {
    constructor(client) {
        super(client, main$2.DocumentLinkRequest.type);
    }
    fillClientCapabilities(capabilities) {
        const documentLinkCapabilities = ensure(ensure(capabilities, 'textDocument'), 'documentLink');
        documentLinkCapabilities.dynamicRegistration = true;
        documentLinkCapabilities.tooltipSupport = true;
    }
    initialize(capabilities, documentSelector) {
        const options = this.getRegistrationOptions(documentSelector, capabilities.documentLinkProvider);
        if (!options) {
            return;
        }
        this.register({ id: uuid.generateUuid(), registerOptions: options });
    }
    registerLanguageProvider(options) {
        const provider = {
            provideDocumentLinks: (document, token) => {
                const client = this._client;
                const provideDocumentLinks = (document, token) => {
                    return client.sendRequest(main$2.DocumentLinkRequest.type, client.code2ProtocolConverter.asDocumentLinkParams(document), token).then(client.protocol2CodeConverter.asDocumentLinks, (error) => {
                        return client.handleFailedRequest(main$2.DocumentLinkRequest.type, error, null);
                    });
                };
                const middleware = client.clientOptions.middleware;
                return middleware.provideDocumentLinks
                    ? middleware.provideDocumentLinks(document, token, provideDocumentLinks)
                    : provideDocumentLinks(document, token);
            },
            resolveDocumentLink: options.resolveProvider
                ? (link, token) => {
                    const client = this._client;
                    let resolveDocumentLink = (link, token) => {
                        return client.sendRequest(main$2.DocumentLinkResolveRequest.type, client.code2ProtocolConverter.asDocumentLink(link), token).then(client.protocol2CodeConverter.asDocumentLink, (error) => {
                            return client.handleFailedRequest(main$2.DocumentLinkResolveRequest.type, error, link);
                        });
                    };
                    const middleware = client.clientOptions.middleware;
                    return middleware.resolveDocumentLink
                        ? middleware.resolveDocumentLink(link, token, resolveDocumentLink)
                        : resolveDocumentLink(link, token);
                }
                : undefined
        };
        return [vscode__default['default'].languages.registerDocumentLinkProvider(options.documentSelector, provider), provider];
    }
}
class ConfigurationFeature {
    constructor(_client) {
        this._client = _client;
        this._listeners = new Map();
    }
    get registrationType() {
        return main$2.DidChangeConfigurationNotification.type;
    }
    fillClientCapabilities(capabilities) {
        ensure(ensure(capabilities, 'workspace'), 'didChangeConfiguration').dynamicRegistration = true;
    }
    initialize() {
        let section = this._client.clientOptions.synchronize.configurationSection;
        if (section !== undefined) {
            this.register({
                id: uuid.generateUuid(),
                registerOptions: {
                    section: section
                }
            });
        }
    }
    register(data) {
        let disposable = vscode__default['default'].workspace.onDidChangeConfiguration((event) => {
            this.onDidChangeConfiguration(data.registerOptions.section, event);
        });
        this._listeners.set(data.id, disposable);
        if (data.registerOptions.section !== undefined) {
            this.onDidChangeConfiguration(data.registerOptions.section, undefined);
        }
    }
    unregister(id) {
        let disposable = this._listeners.get(id);
        if (disposable) {
            this._listeners.delete(id);
            disposable.dispose();
        }
    }
    dispose() {
        for (let disposable of this._listeners.values()) {
            disposable.dispose();
        }
        this._listeners.clear();
    }
    onDidChangeConfiguration(configurationSection, event) {
        let sections;
        if (is.string(configurationSection)) {
            sections = [configurationSection];
        }
        else {
            sections = configurationSection;
        }
        if (sections !== undefined && event !== undefined) {
            let affected = sections.some((section) => event.affectsConfiguration(section));
            if (!affected) {
                return;
            }
        }
        let didChangeConfiguration = (sections) => {
            if (sections === undefined) {
                this._client.sendNotification(main$2.DidChangeConfigurationNotification.type, { settings: null });
                return;
            }
            this._client.sendNotification(main$2.DidChangeConfigurationNotification.type, { settings: this.extractSettingsInformation(sections) });
        };
        let middleware = this.getMiddleware();
        middleware
            ? middleware(sections, didChangeConfiguration)
            : didChangeConfiguration(sections);
    }
    extractSettingsInformation(keys) {
        function ensurePath(config, path) {
            let current = config;
            for (let i = 0; i < path.length - 1; i++) {
                let obj = current[path[i]];
                if (!obj) {
                    obj = Object.create(null);
                    current[path[i]] = obj;
                }
                current = obj;
            }
            return current;
        }
        let resource = this._client.clientOptions.workspaceFolder
            ? this._client.clientOptions.workspaceFolder.uri
            : undefined;
        let result = Object.create(null);
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            let index = key.indexOf('.');
            let config = null;
            if (index >= 0) {
                config = vscode__default['default'].workspace.getConfiguration(key.substr(0, index), resource).get(key.substr(index + 1));
            }
            else {
                config = vscode__default['default'].workspace.getConfiguration(undefined, resource).get(key);
            }
            if (config) {
                let path = keys[i].split('.');
                ensurePath(result, path)[path[path.length - 1]] = configuration.toJSONObject(config);
            }
        }
        return result;
    }
    getMiddleware() {
        let middleware = this._client.clientOptions.middleware;
        if (middleware.workspace && middleware.workspace.didChangeConfiguration) {
            return middleware.workspace.didChangeConfiguration;
        }
        else {
            return undefined;
        }
    }
}
class ExecuteCommandFeature {
    constructor(_client) {
        this._client = _client;
        this._commands = new Map();
    }
    get registrationType() {
        return main$2.ExecuteCommandRequest.type;
    }
    fillClientCapabilities(capabilities) {
        ensure(ensure(capabilities, 'workspace'), 'executeCommand').dynamicRegistration = true;
    }
    initialize(capabilities) {
        if (!capabilities.executeCommandProvider) {
            return;
        }
        this.register({
            id: uuid.generateUuid(),
            registerOptions: Object.assign({}, capabilities.executeCommandProvider)
        });
    }
    register(data) {
        const client = this._client;
        const middleware = client.clientOptions.middleware;
        const executeCommand = (command, args) => {
            let params = {
                command,
                arguments: args
            };
            return client.sendRequest(main$2.ExecuteCommandRequest.type, params).then(undefined, (error) => {
                return client.handleFailedRequest(main$2.ExecuteCommandRequest.type, error, undefined);
            });
        };
        if (data.registerOptions.commands) {
            const disposables = [];
            for (const command of data.registerOptions.commands) {
                disposables.push(vscode__default['default'].commands.registerCommand(command, (...args) => {
                    return middleware.executeCommand
                        ? middleware.executeCommand(command, args, executeCommand)
                        : executeCommand(command, args);
                }));
            }
            this._commands.set(data.id, disposables);
        }
    }
    unregister(id) {
        let disposables = this._commands.get(id);
        if (disposables) {
            disposables.forEach(disposable => disposable.dispose());
        }
    }
    dispose() {
        this._commands.forEach((value) => {
            value.forEach(disposable => disposable.dispose());
        });
        this._commands.clear();
    }
}
var MessageTransports;
(function (MessageTransports) {
    function is(value) {
        let candidate = value;
        return candidate && main$2.MessageReader.is(value.reader) && main$2.MessageWriter.is(value.writer);
    }
    MessageTransports.is = is;
})(MessageTransports = exports.MessageTransports || (exports.MessageTransports = {}));
class OnReady {
    constructor(_resolve, _reject) {
        this._resolve = _resolve;
        this._reject = _reject;
        this._used = false;
    }
    get isUsed() {
        return this._used;
    }
    resolve() {
        this._used = true;
        this._resolve();
    }
    reject(error) {
        this._used = true;
        this._reject(error);
    }
}
class BaseLanguageClient {
    constructor(id, name, clientOptions) {
        var _a;
        this._traceFormat = main$2.TraceFormat.Text;
        this._features = [];
        this._dynamicFeatures = new Map();
        this._id = id;
        this._name = name;
        clientOptions = clientOptions || {};
        const markdown = { isTrusted: false };
        if (clientOptions.markdown !== undefined && clientOptions.markdown.isTrusted === true) {
            markdown.isTrusted = true;
        }
        this._clientOptions = {
            documentSelector: clientOptions.documentSelector || [],
            synchronize: clientOptions.synchronize || {},
            diagnosticCollectionName: clientOptions.diagnosticCollectionName,
            outputChannelName: clientOptions.outputChannelName || this._name,
            revealOutputChannelOn: clientOptions.revealOutputChannelOn || RevealOutputChannelOn.Error,
            stdioEncoding: clientOptions.stdioEncoding || 'utf8',
            initializationOptions: clientOptions.initializationOptions,
            initializationFailedHandler: clientOptions.initializationFailedHandler,
            progressOnInitialization: !!clientOptions.progressOnInitialization,
            errorHandler: clientOptions.errorHandler || this.createDefaultErrorHandler((_a = clientOptions.connectionOptions) === null || _a === void 0 ? void 0 : _a.maxRestartCount),
            middleware: clientOptions.middleware || {},
            uriConverters: clientOptions.uriConverters,
            workspaceFolder: clientOptions.workspaceFolder,
            connectionOptions: clientOptions.connectionOptions,
            markdown
        };
        this._clientOptions.synchronize = this._clientOptions.synchronize || {};
        this._state = ClientState.Initial;
        this._connectionPromise = undefined;
        this._resolvedConnection = undefined;
        this._initializeResult = undefined;
        if (clientOptions.outputChannel) {
            this._outputChannel = clientOptions.outputChannel;
            this._disposeOutputChannel = false;
        }
        else {
            this._outputChannel = undefined;
            this._disposeOutputChannel = true;
        }
        this._traceOutputChannel = clientOptions.traceOutputChannel;
        this._listeners = undefined;
        this._providers = undefined;
        this._diagnostics = undefined;
        this._fileEvents = [];
        this._fileEventDelayer = new async.Delayer(250);
        this._onReady = new Promise((resolve, reject) => {
            this._onReadyCallbacks = new OnReady(resolve, reject);
        });
        this._onStop = undefined;
        this._telemetryEmitter = new main$2.Emitter();
        this._stateChangeEmitter = new main$2.Emitter();
        this._trace = main$2.Trace.Off;
        this._tracer = {
            log: (messageOrDataObject, data) => {
                if (is.string(messageOrDataObject)) {
                    this.logTrace(messageOrDataObject, data);
                }
                else {
                    this.logObjectTrace(messageOrDataObject);
                }
            },
        };
        this._c2p = codeConverter.createConverter(clientOptions.uriConverters ? clientOptions.uriConverters.code2Protocol : undefined);
        this._p2c = protocolConverter.createConverter(clientOptions.uriConverters ? clientOptions.uriConverters.protocol2Code : undefined, this._clientOptions.markdown.isTrusted);
        this._syncedDocuments = new Map();
        this.registerBuiltinFeatures();
    }
    get state() {
        return this._state;
    }
    set state(value) {
        let oldState = this.getPublicState();
        this._state = value;
        let newState = this.getPublicState();
        if (newState !== oldState) {
            this._stateChangeEmitter.fire({ oldState, newState });
        }
    }
    getPublicState() {
        if (this.state === ClientState.Running) {
            return State.Running;
        }
        else if (this.state === ClientState.Starting) {
            return State.Starting;
        }
        else {
            return State.Stopped;
        }
    }
    get initializeResult() {
        return this._initializeResult;
    }
    sendRequest(type, ...params) {
        if (!this.isConnectionActive()) {
            throw new Error('Language client is not ready yet');
        }
        this.forceDocumentSync();
        try {
            return this._resolvedConnection.sendRequest(type, ...params);
        }
        catch (error) {
            this.error(`Sending request ${is.string(type) ? type : type.method} failed.`, error);
            throw error;
        }
    }
    onRequest(type, handler) {
        if (!this.isConnectionActive()) {
            throw new Error('Language client is not ready yet');
        }
        try {
            return this._resolvedConnection.onRequest(type, handler);
        }
        catch (error) {
            this.error(`Registering request handler ${is.string(type) ? type : type.method} failed.`, error);
            throw error;
        }
    }
    sendNotification(type, params) {
        if (!this.isConnectionActive()) {
            throw new Error('Language client is not ready yet');
        }
        this.forceDocumentSync();
        try {
            this._resolvedConnection.sendNotification(type, params);
        }
        catch (error) {
            this.error(`Sending notification ${is.string(type) ? type : type.method} failed.`, error);
            throw error;
        }
    }
    onNotification(type, handler) {
        if (!this.isConnectionActive()) {
            throw new Error('Language client is not ready yet');
        }
        try {
            return this._resolvedConnection.onNotification(type, handler);
        }
        catch (error) {
            this.error(`Registering notification handler ${is.string(type) ? type : type.method} failed.`, error);
            throw error;
        }
    }
    onProgress(type, token, handler) {
        if (!this.isConnectionActive()) {
            throw new Error('Language client is not ready yet');
        }
        try {
            if (main$2.WorkDoneProgress.is(type)) {
                const handleWorkDoneProgress = this._clientOptions.middleware.handleWorkDoneProgress;
                if (handleWorkDoneProgress !== undefined) {
                    return this._resolvedConnection.onProgress(type, token, (params) => {
                        handleWorkDoneProgress(token, params, () => handler(params));
                    });
                }
            }
            return this._resolvedConnection.onProgress(type, token, handler);
        }
        catch (error) {
            this.error(`Registering progress handler for token ${token} failed.`, error);
            throw error;
        }
    }
    sendProgress(type, token, value) {
        if (!this.isConnectionActive()) {
            throw new Error('Language client is not ready yet');
        }
        this.forceDocumentSync();
        try {
            this._resolvedConnection.sendProgress(type, token, value);
        }
        catch (error) {
            this.error(`Sending progress for token ${token} failed.`, error);
            throw error;
        }
    }
    get clientOptions() {
        return this._clientOptions;
    }
    get protocol2CodeConverter() {
        return this._p2c;
    }
    get code2ProtocolConverter() {
        return this._c2p;
    }
    get onTelemetry() {
        return this._telemetryEmitter.event;
    }
    get onDidChangeState() {
        return this._stateChangeEmitter.event;
    }
    get outputChannel() {
        if (!this._outputChannel) {
            this._outputChannel = vscode__default['default'].window.createOutputChannel(this._clientOptions.outputChannelName ? this._clientOptions.outputChannelName : this._name);
        }
        return this._outputChannel;
    }
    get traceOutputChannel() {
        if (this._traceOutputChannel) {
            return this._traceOutputChannel;
        }
        return this.outputChannel;
    }
    get diagnostics() {
        return this._diagnostics;
    }
    createDefaultErrorHandler(maxRestartCount) {
        if (maxRestartCount !== undefined && maxRestartCount < 0) {
            throw new Error(`Invalid maxRestartCount: ${maxRestartCount}`);
        }
        return new DefaultErrorHandler(this._name, maxRestartCount !== null && maxRestartCount !== void 0 ? maxRestartCount : 4);
    }
    set trace(value) {
        this._trace = value;
        this.onReady().then(() => {
            this.resolveConnection().then((connection) => {
                connection.trace(this._trace, this._tracer, {
                    sendNotification: false,
                    traceFormat: this._traceFormat
                });
            });
        }, () => {
        });
    }
    data2String(data) {
        if (data instanceof main$2.ResponseError) {
            const responseError = data;
            return `  Message: ${responseError.message}\n  Code: ${responseError.code} ${responseError.data ? '\n' + responseError.data.toString() : ''}`;
        }
        if (data instanceof Error) {
            if (is.string(data.stack)) {
                return data.stack;
            }
            return data.message;
        }
        if (is.string(data)) {
            return data;
        }
        return data.toString();
    }
    info(message, data, showNotification = true) {
        this.outputChannel.appendLine(`[Info  - ${(new Date().toLocaleTimeString())}] ${message}`);
        if (data) {
            this.outputChannel.appendLine(this.data2String(data));
        }
        if (showNotification && this._clientOptions.revealOutputChannelOn <= RevealOutputChannelOn.Info) {
            this.showNotificationMessage();
        }
    }
    warn(message, data, showNotification = true) {
        this.outputChannel.appendLine(`[Warn  - ${(new Date().toLocaleTimeString())}] ${message}`);
        if (data) {
            this.outputChannel.appendLine(this.data2String(data));
        }
        if (showNotification && this._clientOptions.revealOutputChannelOn <= RevealOutputChannelOn.Warn) {
            this.showNotificationMessage();
        }
    }
    error(message, data, showNotification = true) {
        this.outputChannel.appendLine(`[Error - ${(new Date().toLocaleTimeString())}] ${message}`);
        if (data) {
            this.outputChannel.appendLine(this.data2String(data));
        }
        if (showNotification && this._clientOptions.revealOutputChannelOn <= RevealOutputChannelOn.Error) {
            this.showNotificationMessage();
        }
    }
    showNotificationMessage() {
        vscode__default['default'].window.showInformationMessage('A request has failed. See the output for more information.', 'Go to output').then(() => {
            this.outputChannel.show(true);
        });
    }
    logTrace(message, data) {
        this.traceOutputChannel.appendLine(`[Trace - ${(new Date().toLocaleTimeString())}] ${message}`);
        if (data) {
            this.traceOutputChannel.appendLine(this.data2String(data));
        }
    }
    logObjectTrace(data) {
        if (data.isLSPMessage && data.type) {
            this.traceOutputChannel.append(`[LSP   - ${(new Date().toLocaleTimeString())}] `);
        }
        else {
            this.traceOutputChannel.append(`[Trace - ${(new Date().toLocaleTimeString())}] `);
        }
        if (data) {
            this.traceOutputChannel.appendLine(`${JSON.stringify(data)}`);
        }
    }
    needsStart() {
        return this.state === ClientState.Initial || this.state === ClientState.Stopping || this.state === ClientState.Stopped;
    }
    needsStop() {
        return this.state === ClientState.Starting || this.state === ClientState.Running;
    }
    onReady() {
        return this._onReady;
    }
    isConnectionActive() {
        return this.state === ClientState.Running && !!this._resolvedConnection;
    }
    start() {
        if (this._onReadyCallbacks.isUsed) {
            this._onReady = new Promise((resolve, reject) => {
                this._onReadyCallbacks = new OnReady(resolve, reject);
            });
        }
        this._listeners = [];
        this._providers = [];
        // If we restart then the diagnostics collection is reused.
        if (!this._diagnostics) {
            this._diagnostics = this._clientOptions.diagnosticCollectionName
                ? vscode__default['default'].languages.createDiagnosticCollection(this._clientOptions.diagnosticCollectionName)
                : vscode__default['default'].languages.createDiagnosticCollection();
        }
        this.state = ClientState.Starting;
        this.resolveConnection().then((connection) => {
            connection.onLogMessage((message) => {
                switch (message.type) {
                    case main$2.MessageType.Error:
                        this.error(message.message, undefined, false);
                        break;
                    case main$2.MessageType.Warning:
                        this.warn(message.message, undefined, false);
                        break;
                    case main$2.MessageType.Info:
                        this.info(message.message, undefined, false);
                        break;
                    default:
                        this.outputChannel.appendLine(message.message);
                }
            });
            connection.onShowMessage((message) => {
                switch (message.type) {
                    case main$2.MessageType.Error:
                        vscode__default['default'].window.showErrorMessage(message.message);
                        break;
                    case main$2.MessageType.Warning:
                        vscode__default['default'].window.showWarningMessage(message.message);
                        break;
                    case main$2.MessageType.Info:
                        vscode__default['default'].window.showInformationMessage(message.message);
                        break;
                    default:
                        vscode__default['default'].window.showInformationMessage(message.message);
                }
            });
            connection.onRequest(main$2.ShowMessageRequest.type, (params) => {
                let messageFunc;
                switch (params.type) {
                    case main$2.MessageType.Error:
                        messageFunc = vscode__default['default'].window.showErrorMessage;
                        break;
                    case main$2.MessageType.Warning:
                        messageFunc = vscode__default['default'].window.showWarningMessage;
                        break;
                    case main$2.MessageType.Info:
                        messageFunc = vscode__default['default'].window.showInformationMessage;
                        break;
                    default:
                        messageFunc = vscode__default['default'].window.showInformationMessage;
                }
                let actions = params.actions || [];
                return messageFunc(params.message, ...actions);
            });
            connection.onTelemetry((data) => {
                this._telemetryEmitter.fire(data);
            });
            connection.onRequest(main$2.ShowDocumentRequest.type, async (params) => {
                var _a;
                const showDocument = async (params) => {
                    const uri = this.protocol2CodeConverter.asUri(params.uri);
                    try {
                        if (params.external === true) {
                            const success = await vscode__default['default'].env.openExternal(uri);
                            return { success };
                        }
                        else {
                            const options = {};
                            if (params.selection !== undefined) {
                                options.selection = this.protocol2CodeConverter.asRange(params.selection);
                            }
                            if (params.takeFocus === undefined || params.takeFocus === false) {
                                options.preserveFocus = true;
                            }
                            else if (params.takeFocus === true) {
                                options.preserveFocus = false;
                            }
                            await vscode__default['default'].window.showTextDocument(uri, options);
                            return { success: true };
                        }
                    }
                    catch (error) {
                        return { success: true };
                    }
                };
                const middleware = (_a = this._clientOptions.middleware.window) === null || _a === void 0 ? void 0 : _a.showDocument;
                if (middleware !== undefined) {
                    return middleware(params, showDocument);
                }
                else {
                    return showDocument(params);
                }
            });
            connection.listen();
            // Error is handled in the initialize call.
            return this.initialize(connection);
        }).then(undefined, (error) => {
            this.state = ClientState.StartFailed;
            this._onReadyCallbacks.reject(error);
            this.error('Starting client failed', error);
            vscode__default['default'].window.showErrorMessage(`Couldn't start client ${this._name}`);
        });
        return new vscode__default['default'].Disposable(() => {
            if (this.needsStop()) {
                this.stop();
            }
        });
    }
    resolveConnection() {
        if (!this._connectionPromise) {
            this._connectionPromise = this.createConnection();
        }
        return this._connectionPromise;
    }
    initialize(connection) {
        this.refreshTrace(connection, false);
        let initOption = this._clientOptions.initializationOptions;
        let rootPath = this._clientOptions.workspaceFolder
            ? this._clientOptions.workspaceFolder.uri.fsPath
            : this._clientGetRootPath();
        let initParams = {
            processId: null,
            clientInfo: {
                name: vscode__default['default'].env.appName,
                version: vscode__default['default'].version
            },
            locale: this.getLocale(),
            rootPath: rootPath ? rootPath : null,
            rootUri: rootPath ? this._c2p.asUri(vscode__default['default'].Uri.file(rootPath)) : null,
            capabilities: this.computeClientCapabilities(),
            initializationOptions: is.func(initOption) ? initOption() : initOption,
            trace: main$2.Trace.toString(this._trace),
            workspaceFolders: null
        };
        this.fillInitializeParams(initParams);
        if (this._clientOptions.progressOnInitialization) {
            const token = uuid.generateUuid();
            const part = new progressPart.ProgressPart(connection, token);
            initParams.workDoneToken = token;
            return this.doInitialize(connection, initParams).then((result) => {
                part.done();
                return result;
            }, (error) => {
                part.cancel();
                throw error;
            });
        }
        else {
            return this.doInitialize(connection, initParams);
        }
    }
    doInitialize(connection, initParams) {
        return connection.initialize(initParams).then((result) => {
            this._resolvedConnection = connection;
            this._initializeResult = result;
            this.state = ClientState.Running;
            let textDocumentSyncOptions = undefined;
            if (is.number(result.capabilities.textDocumentSync)) {
                if (result.capabilities.textDocumentSync === main$2.TextDocumentSyncKind.None) {
                    textDocumentSyncOptions = {
                        openClose: false,
                        change: main$2.TextDocumentSyncKind.None,
                        save: undefined
                    };
                }
                else {
                    textDocumentSyncOptions = {
                        openClose: true,
                        change: result.capabilities.textDocumentSync,
                        save: {
                            includeText: false
                        }
                    };
                }
            }
            else if (result.capabilities.textDocumentSync !== undefined && result.capabilities.textDocumentSync !== null) {
                textDocumentSyncOptions = result.capabilities.textDocumentSync;
            }
            this._capabilities = Object.assign({}, result.capabilities, { resolvedTextDocumentSync: textDocumentSyncOptions });
            connection.onDiagnostics(params => this.handleDiagnostics(params));
            connection.onRequest(main$2.RegistrationRequest.type, params => this.handleRegistrationRequest(params));
            // See https://github.com/Microsoft/vscode-languageserver-node/issues/199
            connection.onRequest('client/registerFeature', params => this.handleRegistrationRequest(params));
            connection.onRequest(main$2.UnregistrationRequest.type, params => this.handleUnregistrationRequest(params));
            // See https://github.com/Microsoft/vscode-languageserver-node/issues/199
            connection.onRequest('client/unregisterFeature', params => this.handleUnregistrationRequest(params));
            connection.onRequest(main$2.ApplyWorkspaceEditRequest.type, params => this.handleApplyWorkspaceEdit(params));
            connection.sendNotification(main$2.InitializedNotification.type, {});
            this.hookFileEvents(connection);
            this.hookConfigurationChanged(connection);
            this.initializeFeatures(connection);
            this._onReadyCallbacks.resolve();
            return result;
        }).then(undefined, (error) => {
            if (this._clientOptions.initializationFailedHandler) {
                if (this._clientOptions.initializationFailedHandler(error)) {
                    this.initialize(connection);
                }
                else {
                    this.stop();
                    this._onReadyCallbacks.reject(error);
                }
            }
            else if (error instanceof main$2.ResponseError && error.data && error.data.retry) {
                vscode__default['default'].window.showErrorMessage(error.message, { title: 'Retry', id: 'retry' }).then(item => {
                    if (item && item.id === 'retry') {
                        this.initialize(connection);
                    }
                    else {
                        this.stop();
                        this._onReadyCallbacks.reject(error);
                    }
                });
            }
            else {
                if (error && error.message) {
                    vscode__default['default'].window.showErrorMessage(error.message);
                }
                this.error('Server initialization failed.', error);
                this.stop();
                this._onReadyCallbacks.reject(error);
            }
            throw error;
        });
    }
    _clientGetRootPath() {
        let folders = vscode__default['default'].workspace.workspaceFolders;
        if (!folders || folders.length === 0) {
            return undefined;
        }
        let folder = folders[0];
        if (folder.uri.scheme === 'file') {
            return folder.uri.fsPath;
        }
        return undefined;
    }
    stop() {
        this._initializeResult = undefined;
        if (!this._connectionPromise) {
            this.state = ClientState.Stopped;
            return Promise.resolve();
        }
        if (this.state === ClientState.Stopping && this._onStop) {
            return this._onStop;
        }
        this.state = ClientState.Stopping;
        this.cleanUp(false);
        // unhook listeners
        return this._onStop = this.resolveConnection().then(connection => {
            return connection.shutdown().then(() => {
                connection.exit();
                connection.end();
                connection.dispose();
                this.state = ClientState.Stopped;
                this.cleanUpChannel();
                this._onStop = undefined;
                this._connectionPromise = undefined;
                this._resolvedConnection = undefined;
            });
        });
    }
    cleanUp(channel = true, diagnostics = true) {
        if (this._listeners) {
            this._listeners.forEach(listener => listener.dispose());
            this._listeners = undefined;
        }
        if (this._providers) {
            this._providers.forEach(provider => provider.dispose());
            this._providers = undefined;
        }
        if (this._syncedDocuments) {
            this._syncedDocuments.clear();
        }
        for (const feature of this._features.values()) {
            feature.dispose();
        }
        if (channel) {
            this.cleanUpChannel();
        }
        if (diagnostics && this._diagnostics) {
            this._diagnostics.dispose();
            this._diagnostics = undefined;
        }
    }
    cleanUpChannel() {
        if (this._outputChannel && this._disposeOutputChannel) {
            this._outputChannel.dispose();
            this._outputChannel = undefined;
        }
    }
    notifyFileEvent(event) {
        var _a;
        const client = this;
        function didChangeWatchedFile(event) {
            client._fileEvents.push(event);
            client._fileEventDelayer.trigger(() => {
                client.onReady().then(() => {
                    client.resolveConnection().then(connection => {
                        if (client.isConnectionActive()) {
                            client.forceDocumentSync();
                            connection.didChangeWatchedFiles({ changes: client._fileEvents });
                        }
                        client._fileEvents = [];
                    });
                }, (error) => {
                    client.error(`Notify file events failed.`, error);
                });
            });
        }
        const workSpaceMiddleware = (_a = this.clientOptions.middleware) === null || _a === void 0 ? void 0 : _a.workspace;
        (workSpaceMiddleware === null || workSpaceMiddleware === void 0 ? void 0 : workSpaceMiddleware.didChangeWatchedFile) ? workSpaceMiddleware.didChangeWatchedFile(event, didChangeWatchedFile) : didChangeWatchedFile(event);
    }
    forceDocumentSync() {
        if (this._didChangeTextDocumentFeature === undefined) {
            this._didChangeTextDocumentFeature = this._dynamicFeatures.get(main$2.DidChangeTextDocumentNotification.type.method);
        }
        this._didChangeTextDocumentFeature.forceDelivery();
    }
    handleDiagnostics(params) {
        if (!this._diagnostics) {
            return;
        }
        let uri = this._p2c.asUri(params.uri);
        let diagnostics = this._p2c.asDiagnostics(params.diagnostics);
        let middleware = this.clientOptions.middleware;
        if (middleware.handleDiagnostics) {
            middleware.handleDiagnostics(uri, diagnostics, (uri, diagnostics) => this.setDiagnostics(uri, diagnostics));
        }
        else {
            this.setDiagnostics(uri, diagnostics);
        }
    }
    setDiagnostics(uri, diagnostics) {
        if (!this._diagnostics) {
            return;
        }
        this._diagnostics.set(uri, diagnostics);
    }
    createConnection() {
        let errorHandler = (error, message, count) => {
            this.handleConnectionError(error, message, count);
        };
        let closeHandler = () => {
            this.handleConnectionClosed();
        };
        return this.createMessageTransports(this._clientOptions.stdioEncoding || 'utf8').then((transports) => {
            return createConnection(transports.reader, transports.writer, errorHandler, closeHandler, this._clientOptions.connectionOptions);
        });
    }
    handleConnectionClosed() {
        // Check whether this is a normal shutdown in progress or the client stopped normally.
        if (this.state === ClientState.Stopping || this.state === ClientState.Stopped) {
            return;
        }
        try {
            if (this._resolvedConnection) {
                this._resolvedConnection.dispose();
            }
        }
        catch (error) {
            // Disposing a connection could fail if error cases.
        }
        let action = CloseAction.DoNotRestart;
        try {
            action = this._clientOptions.errorHandler.closed();
        }
        catch (error) {
            // Ignore errors coming from the error handler.
        }
        this._connectionPromise = undefined;
        this._resolvedConnection = undefined;
        if (action === CloseAction.DoNotRestart) {
            this.error('Connection to server got closed. Server will not be restarted.');
            if (this.state === ClientState.Starting) {
                this._onReadyCallbacks.reject(new Error(`Connection to server got closed. Server will not be restarted.`));
                this.state = ClientState.StartFailed;
            }
            else {
                this.state = ClientState.Stopped;
            }
            this.cleanUp(false, true);
        }
        else if (action === CloseAction.Restart) {
            this.info('Connection to server got closed. Server will restart.');
            this.cleanUp(false, false);
            this.state = ClientState.Initial;
            this.start();
        }
    }
    handleConnectionError(error, message, count) {
        let action = this._clientOptions.errorHandler.error(error, message, count);
        if (action === ErrorAction.Shutdown) {
            this.error('Connection to server is erroring. Shutting down server.');
            this.stop();
        }
    }
    hookConfigurationChanged(connection) {
        vscode__default['default'].workspace.onDidChangeConfiguration(() => {
            this.refreshTrace(connection, true);
        });
    }
    refreshTrace(connection, sendNotification = false) {
        let config = vscode__default['default'].workspace.getConfiguration(this._id);
        let trace = main$2.Trace.Off;
        let traceFormat = main$2.TraceFormat.Text;
        if (config) {
            const traceConfig = config.get('trace.server', 'off');
            if (typeof traceConfig === 'string') {
                trace = main$2.Trace.fromString(traceConfig);
            }
            else {
                trace = main$2.Trace.fromString(config.get('trace.server.verbosity', 'off'));
                traceFormat = main$2.TraceFormat.fromString(config.get('trace.server.format', 'text'));
            }
        }
        this._trace = trace;
        this._traceFormat = traceFormat;
        connection.trace(this._trace, this._tracer, {
            sendNotification,
            traceFormat: this._traceFormat
        });
    }
    hookFileEvents(_connection) {
        let fileEvents = this._clientOptions.synchronize.fileEvents;
        if (!fileEvents) {
            return;
        }
        let watchers;
        if (is.array(fileEvents)) {
            watchers = fileEvents;
        }
        else {
            watchers = [fileEvents];
        }
        if (!watchers) {
            return;
        }
        this._dynamicFeatures.get(main$2.DidChangeWatchedFilesNotification.type.method).registerRaw(uuid.generateUuid(), watchers);
    }
    registerFeatures(features) {
        for (let feature of features) {
            this.registerFeature(feature);
        }
    }
    registerFeature(feature) {
        this._features.push(feature);
        if (DynamicFeature.is(feature)) {
            const registrationType = feature.registrationType;
            this._dynamicFeatures.set(registrationType.method, feature);
        }
    }
    getFeature(request) {
        return this._dynamicFeatures.get(request);
    }
    registerBuiltinFeatures() {
        this.registerFeature(new ConfigurationFeature(this));
        this.registerFeature(new DidOpenTextDocumentFeature(this, this._syncedDocuments));
        this.registerFeature(new DidChangeTextDocumentFeature(this));
        this.registerFeature(new WillSaveFeature(this));
        this.registerFeature(new WillSaveWaitUntilFeature(this));
        this.registerFeature(new DidSaveTextDocumentFeature(this));
        this.registerFeature(new DidCloseTextDocumentFeature(this, this._syncedDocuments));
        this.registerFeature(new FileSystemWatcherFeature(this, (event) => this.notifyFileEvent(event)));
        this.registerFeature(new CompletionItemFeature(this));
        this.registerFeature(new HoverFeature(this));
        this.registerFeature(new SignatureHelpFeature(this));
        this.registerFeature(new DefinitionFeature(this));
        this.registerFeature(new ReferencesFeature(this));
        this.registerFeature(new DocumentHighlightFeature(this));
        this.registerFeature(new DocumentSymbolFeature(this));
        this.registerFeature(new WorkspaceSymbolFeature(this));
        this.registerFeature(new CodeActionFeature(this));
        this.registerFeature(new CodeLensFeature(this));
        this.registerFeature(new DocumentFormattingFeature(this));
        this.registerFeature(new DocumentRangeFormattingFeature(this));
        this.registerFeature(new DocumentOnTypeFormattingFeature(this));
        this.registerFeature(new RenameFeature(this));
        this.registerFeature(new DocumentLinkFeature(this));
        this.registerFeature(new ExecuteCommandFeature(this));
    }
    fillInitializeParams(params) {
        for (let feature of this._features) {
            if (is.func(feature.fillInitializeParams)) {
                feature.fillInitializeParams(params);
            }
        }
    }
    computeClientCapabilities() {
        const result = {};
        ensure(result, 'workspace').applyEdit = true;
        const workspaceEdit = ensure(ensure(result, 'workspace'), 'workspaceEdit');
        workspaceEdit.documentChanges = true;
        workspaceEdit.resourceOperations = [main$2.ResourceOperationKind.Create, main$2.ResourceOperationKind.Rename, main$2.ResourceOperationKind.Delete];
        workspaceEdit.failureHandling = main$2.FailureHandlingKind.TextOnlyTransactional;
        workspaceEdit.normalizesLineEndings = true;
        workspaceEdit.changeAnnotationSupport = {
            groupsOnLabel: true
        };
        const diagnostics = ensure(ensure(result, 'textDocument'), 'publishDiagnostics');
        diagnostics.relatedInformation = true;
        diagnostics.versionSupport = false;
        diagnostics.tagSupport = { valueSet: [main$2.DiagnosticTag.Unnecessary, main$2.DiagnosticTag.Deprecated] };
        diagnostics.codeDescriptionSupport = true;
        diagnostics.dataSupport = true;
        const windowCapabilities = ensure(result, 'window');
        const showMessage = ensure(windowCapabilities, 'showMessage');
        showMessage.messageActionItem = { additionalPropertiesSupport: true };
        const showDocument = ensure(windowCapabilities, 'showDocument');
        showDocument.support = true;
        const generalCapabilities = ensure(result, 'general');
        generalCapabilities.regularExpressions = { engine: 'ECMAScript', version: 'ES2020' };
        generalCapabilities.markdown = { parser: 'marked', version: '1.1.0' };
        for (let feature of this._features) {
            feature.fillClientCapabilities(result);
        }
        return result;
    }
    initializeFeatures(_connection) {
        let documentSelector = this._clientOptions.documentSelector;
        for (let feature of this._features) {
            feature.initialize(this._capabilities, documentSelector);
        }
    }
    handleRegistrationRequest(params) {
        return new Promise((resolve, reject) => {
            for (const registration of params.registrations) {
                const feature = this._dynamicFeatures.get(registration.method);
                if (feature === undefined) {
                    reject(new Error(`No feature implementation for ${registration.method} found. Registration failed.`));
                    return;
                }
                const options = registration.registerOptions || {};
                options.documentSelector = options.documentSelector || this._clientOptions.documentSelector;
                const data = {
                    id: registration.id,
                    registerOptions: options
                };
                try {
                    feature.register(data);
                }
                catch (err) {
                    reject(err);
                    return;
                }
            }
            resolve();
        });
    }
    handleUnregistrationRequest(params) {
        return new Promise((resolve, reject) => {
            for (let unregistration of params.unregisterations) {
                const feature = this._dynamicFeatures.get(unregistration.method);
                if (!feature) {
                    reject(new Error(`No feature implementation for ${unregistration.method} found. Unregistration failed.`));
                    return;
                }
                feature.unregister(unregistration.id);
            }
            resolve();
        });
    }
    handleApplyWorkspaceEdit(params) {
        // This is some sort of workaround since the version check should be done by VS Code in the Workspace.applyEdit.
        // However doing it here adds some safety since the server can lag more behind then an extension.
        let workspaceEdit = params.edit;
        let openTextDocuments = new Map();
        vscode__default['default'].workspace.textDocuments.forEach((document) => openTextDocuments.set(document.uri.toString(), document));
        let versionMismatch = false;
        if (workspaceEdit.documentChanges) {
            for (const change of workspaceEdit.documentChanges) {
                if (main$2.TextDocumentEdit.is(change) && change.textDocument.version && change.textDocument.version >= 0) {
                    let textDocument = openTextDocuments.get(change.textDocument.uri);
                    if (textDocument && textDocument.version !== change.textDocument.version) {
                        versionMismatch = true;
                        break;
                    }
                }
            }
        }
        if (versionMismatch) {
            return Promise.resolve({ applied: false });
        }
        return is.asPromise(vscode__default['default'].workspace.applyEdit(this._p2c.asWorkspaceEdit(params.edit)).then((value) => { return { applied: value }; }));
    }
    handleFailedRequest(type, error, defaultValue) {
        // If we get a request cancel or a content modified don't log anything.
        if (error instanceof main$2.ResponseError) {
            if (error.code === main$2.LSPErrorCodes.RequestCancelled) {
                throw this.makeCancelError();
            }
            else if (error.code === main$2.LSPErrorCodes.ContentModified) {
                return defaultValue;
            }
        }
        this.error(`Request ${type.method} failed.`, error);
        throw error;
    }
    makeCancelError() {
        const result = new Error(BaseLanguageClient.Canceled);
        result.name = BaseLanguageClient.Canceled;
        return result;
    }
}
exports.BaseLanguageClient = BaseLanguageClient;
BaseLanguageClient.Canceled = 'Canceled';

});

var colorProvider = createCommonjsModule(function (module, exports) {
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColorProviderFeature = void 0;



function ensure(target, key) {
    if (target[key] === void 0) {
        target[key] = {};
    }
    return target[key];
}
class ColorProviderFeature extends client.TextDocumentFeature {
    constructor(client) {
        super(client, main$2.DocumentColorRequest.type);
    }
    fillClientCapabilities(capabilities) {
        ensure(ensure(capabilities, 'textDocument'), 'colorProvider').dynamicRegistration = true;
    }
    initialize(capabilities, documentSelector) {
        let [id, options] = this.getRegistration(documentSelector, capabilities.colorProvider);
        if (!id || !options) {
            return;
        }
        this.register({ id: id, registerOptions: options });
    }
    registerLanguageProvider(options) {
        const provider = {
            provideColorPresentations: (color, context, token) => {
                const client = this._client;
                const provideColorPresentations = (color, context, token) => {
                    const requestParams = {
                        color,
                        textDocument: client.code2ProtocolConverter.asTextDocumentIdentifier(context.document),
                        range: client.code2ProtocolConverter.asRange(context.range)
                    };
                    return client.sendRequest(main$2.ColorPresentationRequest.type, requestParams, token).then(this.asColorPresentations.bind(this), (error) => {
                        return client.handleFailedRequest(main$2.ColorPresentationRequest.type, error, null);
                    });
                };
                const middleware = client.clientOptions.middleware;
                return middleware.provideColorPresentations
                    ? middleware.provideColorPresentations(color, context, token, provideColorPresentations)
                    : provideColorPresentations(color, context, token);
            },
            provideDocumentColors: (document, token) => {
                const client = this._client;
                const provideDocumentColors = (document, token) => {
                    const requestParams = {
                        textDocument: client.code2ProtocolConverter.asTextDocumentIdentifier(document)
                    };
                    return client.sendRequest(main$2.DocumentColorRequest.type, requestParams, token).then(this.asColorInformations.bind(this), (error) => {
                        return client.handleFailedRequest(main$2.ColorPresentationRequest.type, error, null);
                    });
                };
                const middleware = client.clientOptions.middleware;
                return middleware.provideDocumentColors
                    ? middleware.provideDocumentColors(document, token, provideDocumentColors)
                    : provideDocumentColors(document, token);
            }
        };
        return [vscode__default['default'].languages.registerColorProvider(options.documentSelector, provider), provider];
    }
    asColor(color) {
        return new vscode__default['default'].Color(color.red, color.green, color.blue, color.alpha);
    }
    asColorInformations(colorInformation) {
        if (Array.isArray(colorInformation)) {
            return colorInformation.map(ci => {
                return new vscode__default['default'].ColorInformation(this._client.protocol2CodeConverter.asRange(ci.range), this.asColor(ci.color));
            });
        }
        return [];
    }
    asColorPresentations(colorPresentations) {
        if (Array.isArray(colorPresentations)) {
            return colorPresentations.map(cp => {
                let presentation = new vscode__default['default'].ColorPresentation(cp.label);
                presentation.additionalTextEdits = this._client.protocol2CodeConverter.asTextEdits(cp.additionalTextEdits);
                presentation.textEdit = this._client.protocol2CodeConverter.asTextEdit(cp.textEdit);
                return presentation;
            });
        }
        return [];
    }
}
exports.ColorProviderFeature = ColorProviderFeature;

});

var implementation = createCommonjsModule(function (module, exports) {
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImplementationFeature = void 0;



function ensure(target, key) {
    if (target[key] === void 0) {
        target[key] = {};
    }
    return target[key];
}
class ImplementationFeature extends client.TextDocumentFeature {
    constructor(client) {
        super(client, main$2.ImplementationRequest.type);
    }
    fillClientCapabilities(capabilities) {
        let implementationSupport = ensure(ensure(capabilities, 'textDocument'), 'implementation');
        implementationSupport.dynamicRegistration = true;
        implementationSupport.linkSupport = true;
    }
    initialize(capabilities, documentSelector) {
        let [id, options] = this.getRegistration(documentSelector, capabilities.implementationProvider);
        if (!id || !options) {
            return;
        }
        this.register({ id: id, registerOptions: options });
    }
    registerLanguageProvider(options) {
        const provider = {
            provideImplementation: (document, position, token) => {
                const client = this._client;
                const provideImplementation = (document, position, token) => {
                    return client.sendRequest(main$2.ImplementationRequest.type, client.code2ProtocolConverter.asTextDocumentPositionParams(document, position), token).then(client.protocol2CodeConverter.asDefinitionResult, (error) => {
                        return client.handleFailedRequest(main$2.ImplementationRequest.type, error, null);
                    });
                };
                const middleware = client.clientOptions.middleware;
                return middleware.provideImplementation
                    ? middleware.provideImplementation(document, position, token, provideImplementation)
                    : provideImplementation(document, position, token);
            }
        };
        return [vscode__default['default'].languages.registerImplementationProvider(options.documentSelector, provider), provider];
    }
}
exports.ImplementationFeature = ImplementationFeature;

});

var typeDefinition = createCommonjsModule(function (module, exports) {
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeDefinitionFeature = void 0;



function ensure(target, key) {
    if (target[key] === void 0) {
        target[key] = {};
    }
    return target[key];
}
class TypeDefinitionFeature extends client.TextDocumentFeature {
    constructor(client) {
        super(client, main$2.TypeDefinitionRequest.type);
    }
    fillClientCapabilities(capabilities) {
        ensure(ensure(capabilities, 'textDocument'), 'typeDefinition').dynamicRegistration = true;
        let typeDefinitionSupport = ensure(ensure(capabilities, 'textDocument'), 'typeDefinition');
        typeDefinitionSupport.dynamicRegistration = true;
        typeDefinitionSupport.linkSupport = true;
    }
    initialize(capabilities, documentSelector) {
        let [id, options] = this.getRegistration(documentSelector, capabilities.typeDefinitionProvider);
        if (!id || !options) {
            return;
        }
        this.register({ id: id, registerOptions: options });
    }
    registerLanguageProvider(options) {
        const provider = {
            provideTypeDefinition: (document, position, token) => {
                const client = this._client;
                const provideTypeDefinition = (document, position, token) => {
                    return client.sendRequest(main$2.TypeDefinitionRequest.type, client.code2ProtocolConverter.asTextDocumentPositionParams(document, position), token).then(client.protocol2CodeConverter.asDefinitionResult, (error) => {
                        return client.handleFailedRequest(main$2.TypeDefinitionRequest.type, error, null);
                    });
                };
                const middleware = client.clientOptions.middleware;
                return middleware.provideTypeDefinition
                    ? middleware.provideTypeDefinition(document, position, token, provideTypeDefinition)
                    : provideTypeDefinition(document, position, token);
            }
        };
        return [vscode__default['default'].languages.registerTypeDefinitionProvider(options.documentSelector, provider), provider];
    }
}
exports.TypeDefinitionFeature = TypeDefinitionFeature;

});

var workspaceFolders = createCommonjsModule(function (module, exports) {
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkspaceFoldersFeature = exports.arrayDiff = void 0;



function access(target, key) {
    if (target === void 0) {
        return undefined;
    }
    return target[key];
}
function arrayDiff(left, right) {
    return left.filter(element => right.indexOf(element) < 0);
}
exports.arrayDiff = arrayDiff;
class WorkspaceFoldersFeature {
    constructor(_client) {
        this._client = _client;
        this._listeners = new Map();
    }
    get registrationType() {
        return main$2.DidChangeWorkspaceFoldersNotification.type;
    }
    fillInitializeParams(params) {
        const folders = vscode__default['default'].workspace.workspaceFolders;
        this.initializeWithFolders(folders);
        if (folders === void 0) {
            params.workspaceFolders = null;
        }
        else {
            params.workspaceFolders = folders.map(folder => this.asProtocol(folder));
        }
    }
    initializeWithFolders(currentWorkspaceFolders) {
        this._initialFolders = currentWorkspaceFolders;
    }
    fillClientCapabilities(capabilities) {
        capabilities.workspace = capabilities.workspace || {};
        capabilities.workspace.workspaceFolders = true;
    }
    initialize(capabilities) {
        const client = this._client;
        client.onRequest(main$2.WorkspaceFoldersRequest.type, (token) => {
            const workspaceFolders = () => {
                const folders = vscode__default['default'].workspace.workspaceFolders;
                if (folders === undefined) {
                    return null;
                }
                const result = folders.map((folder) => {
                    return this.asProtocol(folder);
                });
                return result;
            };
            const middleware = client.clientOptions.middleware.workspace;
            return middleware && middleware.workspaceFolders
                ? middleware.workspaceFolders(token, workspaceFolders)
                : workspaceFolders();
        });
        const value = access(access(access(capabilities, 'workspace'), 'workspaceFolders'), 'changeNotifications');
        let id;
        if (typeof value === 'string') {
            id = value;
        }
        else if (value === true) {
            id = uuid.generateUuid();
        }
        if (id) {
            this.register({ id: id, registerOptions: undefined });
        }
    }
    sendInitialEvent(currentWorkspaceFolders) {
        if (this._initialFolders && currentWorkspaceFolders) {
            const removed = arrayDiff(this._initialFolders, currentWorkspaceFolders);
            const added = arrayDiff(currentWorkspaceFolders, this._initialFolders);
            if (added.length > 0 || removed.length > 0) {
                this.doSendEvent(added, removed);
            }
        }
        else if (this._initialFolders) {
            this.doSendEvent([], this._initialFolders);
        }
        else if (currentWorkspaceFolders) {
            this.doSendEvent(currentWorkspaceFolders, []);
        }
    }
    doSendEvent(addedFolders, removedFolders) {
        let params = {
            event: {
                added: addedFolders.map(folder => this.asProtocol(folder)),
                removed: removedFolders.map(folder => this.asProtocol(folder))
            }
        };
        this._client.sendNotification(main$2.DidChangeWorkspaceFoldersNotification.type, params);
    }
    register(data) {
        let id = data.id;
        let client = this._client;
        let disposable = vscode__default['default'].workspace.onDidChangeWorkspaceFolders((event) => {
            let didChangeWorkspaceFolders = (event) => {
                this.doSendEvent(event.added, event.removed);
            };
            let middleware = client.clientOptions.middleware.workspace;
            middleware && middleware.didChangeWorkspaceFolders
                ? middleware.didChangeWorkspaceFolders(event, didChangeWorkspaceFolders)
                : didChangeWorkspaceFolders(event);
        });
        this._listeners.set(id, disposable);
        this.sendInitialEvent(vscode__default['default'].workspace.workspaceFolders);
    }
    unregister(id) {
        let disposable = this._listeners.get(id);
        if (disposable === void 0) {
            return;
        }
        this._listeners.delete(id);
        disposable.dispose();
    }
    dispose() {
        for (let disposable of this._listeners.values()) {
            disposable.dispose();
        }
        this._listeners.clear();
    }
    asProtocol(workspaceFolder) {
        if (workspaceFolder === void 0) {
            return null;
        }
        return { uri: this._client.code2ProtocolConverter.asUri(workspaceFolder.uri), name: workspaceFolder.name };
    }
}
exports.WorkspaceFoldersFeature = WorkspaceFoldersFeature;

});

var foldingRange = createCommonjsModule(function (module, exports) {
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
Object.defineProperty(exports, "__esModule", { value: true });
exports.FoldingRangeFeature = void 0;



function ensure(target, key) {
    if (target[key] === void 0) {
        target[key] = {};
    }
    return target[key];
}
class FoldingRangeFeature extends client.TextDocumentFeature {
    constructor(client) {
        super(client, main$2.FoldingRangeRequest.type);
    }
    fillClientCapabilities(capabilities) {
        let capability = ensure(ensure(capabilities, 'textDocument'), 'foldingRange');
        capability.dynamicRegistration = true;
        capability.rangeLimit = 5000;
        capability.lineFoldingOnly = true;
    }
    initialize(capabilities, documentSelector) {
        let [id, options] = this.getRegistration(documentSelector, capabilities.foldingRangeProvider);
        if (!id || !options) {
            return;
        }
        this.register({ id: id, registerOptions: options });
    }
    registerLanguageProvider(options) {
        const provider = {
            provideFoldingRanges: (document, context, token) => {
                const client = this._client;
                const provideFoldingRanges = (document, _, token) => {
                    const requestParams = {
                        textDocument: client.code2ProtocolConverter.asTextDocumentIdentifier(document)
                    };
                    return client.sendRequest(main$2.FoldingRangeRequest.type, requestParams, token).then(FoldingRangeFeature.asFoldingRanges, (error) => {
                        return client.handleFailedRequest(main$2.FoldingRangeRequest.type, error, null);
                    });
                };
                const middleware = client.clientOptions.middleware;
                return middleware.provideFoldingRanges
                    ? middleware.provideFoldingRanges(document, context, token, provideFoldingRanges)
                    : provideFoldingRanges(document, context, token);
            }
        };
        return [vscode__default['default'].languages.registerFoldingRangeProvider(options.documentSelector, provider), provider];
    }
    static asFoldingRangeKind(kind) {
        if (kind) {
            switch (kind) {
                case main$2.FoldingRangeKind.Comment:
                    return vscode__default['default'].FoldingRangeKind.Comment;
                case main$2.FoldingRangeKind.Imports:
                    return vscode__default['default'].FoldingRangeKind.Imports;
                case main$2.FoldingRangeKind.Region:
                    return vscode__default['default'].FoldingRangeKind.Region;
            }
        }
        return void 0;
    }
    static asFoldingRanges(foldingRanges) {
        if (Array.isArray(foldingRanges)) {
            return foldingRanges.map(r => {
                return new vscode__default['default'].FoldingRange(r.startLine, r.endLine, FoldingRangeFeature.asFoldingRangeKind(r.kind));
            });
        }
        return [];
    }
}
exports.FoldingRangeFeature = FoldingRangeFeature;

});

var declaration = createCommonjsModule(function (module, exports) {
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeclarationFeature = void 0;



function ensure(target, key) {
    if (target[key] === void 0) {
        target[key] = {};
    }
    return target[key];
}
class DeclarationFeature extends client.TextDocumentFeature {
    constructor(client) {
        super(client, main$2.DeclarationRequest.type);
    }
    fillClientCapabilities(capabilities) {
        const declarationSupport = ensure(ensure(capabilities, 'textDocument'), 'declaration');
        declarationSupport.dynamicRegistration = true;
        declarationSupport.linkSupport = true;
    }
    initialize(capabilities, documentSelector) {
        const [id, options] = this.getRegistration(documentSelector, capabilities.declarationProvider);
        if (!id || !options) {
            return;
        }
        this.register({ id: id, registerOptions: options });
    }
    registerLanguageProvider(options) {
        const provider = {
            provideDeclaration: (document, position, token) => {
                const client = this._client;
                const provideDeclaration = (document, position, token) => {
                    return client.sendRequest(main$2.DeclarationRequest.type, client.code2ProtocolConverter.asTextDocumentPositionParams(document, position), token).then(client.protocol2CodeConverter.asDeclarationResult, (error) => {
                        return client.handleFailedRequest(main$2.DeclarationRequest.type, error, null);
                    });
                };
                const middleware = client.clientOptions.middleware;
                return middleware.provideDeclaration
                    ? middleware.provideDeclaration(document, position, token, provideDeclaration)
                    : provideDeclaration(document, position, token);
            }
        };
        return [vscode__default['default'].languages.registerDeclarationProvider(options.documentSelector, provider), provider];
    }
}
exports.DeclarationFeature = DeclarationFeature;

});

var selectionRange = createCommonjsModule(function (module, exports) {
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectionRangeFeature = void 0;



function ensure(target, key) {
    if (target[key] === void 0) {
        target[key] = Object.create(null);
    }
    return target[key];
}
class SelectionRangeFeature extends client.TextDocumentFeature {
    constructor(client) {
        super(client, main$2.SelectionRangeRequest.type);
    }
    fillClientCapabilities(capabilities) {
        let capability = ensure(ensure(capabilities, 'textDocument'), 'selectionRange');
        capability.dynamicRegistration = true;
    }
    initialize(capabilities, documentSelector) {
        let [id, options] = this.getRegistration(documentSelector, capabilities.selectionRangeProvider);
        if (!id || !options) {
            return;
        }
        this.register({ id: id, registerOptions: options });
    }
    registerLanguageProvider(options) {
        const provider = {
            provideSelectionRanges: (document, positions, token) => {
                const client = this._client;
                const provideSelectionRanges = (document, positions, token) => {
                    const requestParams = {
                        textDocument: client.code2ProtocolConverter.asTextDocumentIdentifier(document),
                        positions: client.code2ProtocolConverter.asPositions(positions)
                    };
                    return client.sendRequest(main$2.SelectionRangeRequest.type, requestParams, token).then((ranges) => client.protocol2CodeConverter.asSelectionRanges(ranges), (error) => {
                        return client.handleFailedRequest(main$2.SelectionRangeRequest.type, error, null);
                    });
                };
                const middleware = client.clientOptions.middleware;
                return middleware.provideSelectionRanges
                    ? middleware.provideSelectionRanges(document, positions, token, provideSelectionRanges)
                    : provideSelectionRanges(document, positions, token);
            }
        };
        return [vscode__default['default'].languages.registerSelectionRangeProvider(options.documentSelector, provider), provider];
    }
}
exports.SelectionRangeFeature = SelectionRangeFeature;

});

var progress = createCommonjsModule(function (module, exports) {
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressFeature = void 0;


function ensure(target, key) {
    if (target[key] === void 0) {
        target[key] = Object.create(null);
    }
    return target[key];
}
class ProgressFeature {
    constructor(_client) {
        this._client = _client;
        this.activeParts = new Set();
    }
    fillClientCapabilities(capabilities) {
        ensure(capabilities, 'window').workDoneProgress = true;
    }
    initialize() {
        const client = this._client;
        const deleteHandler = (part) => {
            this.activeParts.delete(part);
        };
        const createHandler = (params) => {
            this.activeParts.add(new progressPart.ProgressPart(this._client, params.token, deleteHandler));
        };
        client.onRequest(main$2.WorkDoneProgressCreateRequest.type, createHandler);
    }
    dispose() {
        for (const part of this.activeParts) {
            part.done();
        }
        this.activeParts.clear();
    }
}
exports.ProgressFeature = ProgressFeature;

});

var callHierarchy = createCommonjsModule(function (module, exports) {
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CallHierarchyFeature = void 0;



function ensure(target, key) {
    if (target[key] === void 0) {
        target[key] = {};
    }
    return target[key];
}
class CallHierarchyProvider {
    constructor(client) {
        this.client = client;
        this.middleware = client.clientOptions.middleware;
    }
    prepareCallHierarchy(document, position, token) {
        const client = this.client;
        const middleware = this.middleware;
        const prepareCallHierarchy = (document, position, token) => {
            const params = client.code2ProtocolConverter.asTextDocumentPositionParams(document, position);
            return client.sendRequest(main$2.CallHierarchyPrepareRequest.type, params, token).then((result) => {
                return client.protocol2CodeConverter.asCallHierarchyItems(result);
            }, (error) => {
                return client.handleFailedRequest(main$2.CallHierarchyPrepareRequest.type, error, null);
            });
        };
        return middleware.prepareCallHierarchy
            ? middleware.prepareCallHierarchy(document, position, token, prepareCallHierarchy)
            : prepareCallHierarchy(document, position, token);
    }
    provideCallHierarchyIncomingCalls(item, token) {
        const client = this.client;
        const middleware = this.middleware;
        const provideCallHierarchyIncomingCalls = (item, token) => {
            const params = {
                item: client.code2ProtocolConverter.asCallHierarchyItem(item)
            };
            return client.sendRequest(main$2.CallHierarchyIncomingCallsRequest.type, params, token).then((result) => {
                return client.protocol2CodeConverter.asCallHierarchyIncomingCalls(result);
            }, (error) => {
                return client.handleFailedRequest(main$2.CallHierarchyIncomingCallsRequest.type, error, null);
            });
        };
        return middleware.provideCallHierarchyIncomingCalls
            ? middleware.provideCallHierarchyIncomingCalls(item, token, provideCallHierarchyIncomingCalls)
            : provideCallHierarchyIncomingCalls(item, token);
    }
    provideCallHierarchyOutgoingCalls(item, token) {
        const client = this.client;
        const middleware = this.middleware;
        const provideCallHierarchyOutgoingCalls = (item, token) => {
            const params = {
                item: client.code2ProtocolConverter.asCallHierarchyItem(item)
            };
            return client.sendRequest(main$2.CallHierarchyOutgoingCallsRequest.type, params, token).then((result) => {
                return client.protocol2CodeConverter.asCallHierarchyOutgoingCalls(result);
            }, (error) => {
                return client.handleFailedRequest(main$2.CallHierarchyOutgoingCallsRequest.type, error, null);
            });
        };
        return middleware.provideCallHierarchyOutgoingCalls
            ? middleware.provideCallHierarchyOutgoingCalls(item, token, provideCallHierarchyOutgoingCalls)
            : provideCallHierarchyOutgoingCalls(item, token);
    }
}
class CallHierarchyFeature extends client.TextDocumentFeature {
    constructor(client) {
        super(client, main$2.CallHierarchyPrepareRequest.type);
    }
    fillClientCapabilities(cap) {
        const capabilities = cap;
        const capability = ensure(ensure(capabilities, 'textDocument'), 'callHierarchy');
        capability.dynamicRegistration = true;
    }
    initialize(capabilities, documentSelector) {
        const [id, options] = this.getRegistration(documentSelector, capabilities.callHierarchyProvider);
        if (!id || !options) {
            return;
        }
        this.register({ id: id, registerOptions: options });
    }
    registerLanguageProvider(options) {
        const client = this._client;
        const provider = new CallHierarchyProvider(client);
        return [vscode__default['default'].languages.registerCallHierarchyProvider(options.documentSelector, provider), provider];
    }
}
exports.CallHierarchyFeature = CallHierarchyFeature;

});

var semanticTokens = createCommonjsModule(function (module, exports) {
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SemanticTokensFeature = void 0;




function ensure(target, key) {
    if (target[key] === void 0) {
        target[key] = {};
    }
    return target[key];
}
class SemanticTokensFeature extends client.TextDocumentFeature {
    constructor(client) {
        super(client, main$2.SemanticTokensRegistrationType.type);
    }
    fillClientCapabilities(capabilities) {
        const capability = ensure(ensure(capabilities, 'textDocument'), 'semanticTokens');
        capability.dynamicRegistration = true;
        capability.tokenTypes = [
            main$2.SemanticTokenTypes.namespace,
            main$2.SemanticTokenTypes.type,
            main$2.SemanticTokenTypes.class,
            main$2.SemanticTokenTypes.enum,
            main$2.SemanticTokenTypes.interface,
            main$2.SemanticTokenTypes.struct,
            main$2.SemanticTokenTypes.typeParameter,
            main$2.SemanticTokenTypes.parameter,
            main$2.SemanticTokenTypes.variable,
            main$2.SemanticTokenTypes.property,
            main$2.SemanticTokenTypes.enumMember,
            main$2.SemanticTokenTypes.event,
            main$2.SemanticTokenTypes.function,
            main$2.SemanticTokenTypes.method,
            main$2.SemanticTokenTypes.macro,
            main$2.SemanticTokenTypes.keyword,
            main$2.SemanticTokenTypes.modifier,
            main$2.SemanticTokenTypes.comment,
            main$2.SemanticTokenTypes.string,
            main$2.SemanticTokenTypes.number,
            main$2.SemanticTokenTypes.regexp,
            main$2.SemanticTokenTypes.operator
        ];
        capability.tokenModifiers = [
            main$2.SemanticTokenModifiers.declaration,
            main$2.SemanticTokenModifiers.definition,
            main$2.SemanticTokenModifiers.readonly,
            main$2.SemanticTokenModifiers.static,
            main$2.SemanticTokenModifiers.deprecated,
            main$2.SemanticTokenModifiers.abstract,
            main$2.SemanticTokenModifiers.async,
            main$2.SemanticTokenModifiers.modification,
            main$2.SemanticTokenModifiers.documentation,
            main$2.SemanticTokenModifiers.defaultLibrary
        ];
        capability.formats = [main$2.TokenFormat.Relative];
        capability.requests = {
            range: true,
            full: {
                delta: true
            }
        };
        capability.multilineTokenSupport = false;
        capability.overlappingTokenSupport = false;
        ensure(ensure(capabilities, 'workspace'), 'semanticTokens').refreshSupport = true;
    }
    initialize(capabilities, documentSelector) {
        const client = this._client;
        client.onRequest(main$2.SemanticTokensRefreshRequest.type, async () => {
            for (const provider of this.getAllProviders()) {
                provider.onDidChangeSemanticTokensEmitter.fire();
            }
        });
        const [id, options] = this.getRegistration(documentSelector, capabilities.semanticTokensProvider);
        if (!id || !options) {
            return;
        }
        this.register({ id: id, registerOptions: options });
    }
    registerLanguageProvider(options) {
        const fullProvider = is.boolean(options.full) ? options.full : options.full !== undefined;
        const hasEditProvider = options.full !== undefined && typeof options.full !== 'boolean' && options.full.delta === true;
        const eventEmitter = new vscode__default['default'].EventEmitter();
        const documentProvider = fullProvider
            ? {
                onDidChangeSemanticTokens: eventEmitter.event,
                provideDocumentSemanticTokens: (document, token) => {
                    const client = this._client;
                    const middleware = client.clientOptions.middleware;
                    const provideDocumentSemanticTokens = (document, token) => {
                        const params = {
                            textDocument: client.code2ProtocolConverter.asTextDocumentIdentifier(document)
                        };
                        return client.sendRequest(main$2.SemanticTokensRequest.type, params, token).then((result) => {
                            return client.protocol2CodeConverter.asSemanticTokens(result);
                        }, (error) => {
                            return client.handleFailedRequest(main$2.SemanticTokensRequest.type, error, null);
                        });
                    };
                    return middleware.provideDocumentSemanticTokens
                        ? middleware.provideDocumentSemanticTokens(document, token, provideDocumentSemanticTokens)
                        : provideDocumentSemanticTokens(document, token);
                },
                provideDocumentSemanticTokensEdits: hasEditProvider
                    ? (document, previousResultId, token) => {
                        const client = this._client;
                        const middleware = client.clientOptions.middleware;
                        const provideDocumentSemanticTokensEdits = (document, previousResultId, token) => {
                            const params = {
                                textDocument: client.code2ProtocolConverter.asTextDocumentIdentifier(document),
                                previousResultId
                            };
                            return client.sendRequest(main$2.SemanticTokensDeltaRequest.type, params, token).then((result) => {
                                if (main$2.SemanticTokens.is(result)) {
                                    return client.protocol2CodeConverter.asSemanticTokens(result);
                                }
                                else {
                                    return client.protocol2CodeConverter.asSemanticTokensEdits(result);
                                }
                            }, (error) => {
                                return client.handleFailedRequest(main$2.SemanticTokensDeltaRequest.type, error, null);
                            });
                        };
                        return middleware.provideDocumentSemanticTokensEdits
                            ? middleware.provideDocumentSemanticTokensEdits(document, previousResultId, token, provideDocumentSemanticTokensEdits)
                            : provideDocumentSemanticTokensEdits(document, previousResultId, token);
                    }
                    : undefined
            }
            : undefined;
        const hasRangeProvider = options.range === true;
        const rangeProvider = hasRangeProvider
            ? {
                provideDocumentRangeSemanticTokens: (document, range, token) => {
                    const client = this._client;
                    const middleware = client.clientOptions.middleware;
                    const provideDocumentRangeSemanticTokens = (document, range, token) => {
                        const params = {
                            textDocument: client.code2ProtocolConverter.asTextDocumentIdentifier(document),
                            range: client.code2ProtocolConverter.asRange(range)
                        };
                        return client.sendRequest(main$2.SemanticTokensRangeRequest.type, params, token).then((result) => {
                            return client.protocol2CodeConverter.asSemanticTokens(result);
                        }, (error) => {
                            return client.handleFailedRequest(main$2.SemanticTokensRangeRequest.type, error, null);
                        });
                    };
                    return middleware.provideDocumentRangeSemanticTokens
                        ? middleware.provideDocumentRangeSemanticTokens(document, range, token, provideDocumentRangeSemanticTokens)
                        : provideDocumentRangeSemanticTokens(document, range, token);
                }
            }
            : undefined;
        const disposables = [];
        const client = this._client;
        const legend = client.protocol2CodeConverter.asSemanticTokensLegend(options.legend);
        if (documentProvider !== undefined) {
            disposables.push(vscode__default['default'].languages.registerDocumentSemanticTokensProvider(options.documentSelector, documentProvider, legend));
        }
        if (rangeProvider !== undefined) {
            disposables.push(vscode__default['default'].languages.registerDocumentRangeSemanticTokensProvider(options.documentSelector, rangeProvider, legend));
        }
        return [new vscode__default['default'].Disposable(() => disposables.forEach(item => item.dispose())), { range: rangeProvider, full: documentProvider, onDidChangeSemanticTokensEmitter: eventEmitter }];
    }
}
exports.SemanticTokensFeature = SemanticTokensFeature;

});

var concatMap = function (xs, fn) {
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        var x = fn(xs[i], i);
        if (isArray(x)) res.push.apply(res, x);
        else res.push(x);
    }
    return res;
};

var isArray = Array.isArray || function (xs) {
    return Object.prototype.toString.call(xs) === '[object Array]';
};

var balancedMatch = balanced;
function balanced(a, b, str) {
  if (a instanceof RegExp) a = maybeMatch(a, str);
  if (b instanceof RegExp) b = maybeMatch(b, str);

  var r = range$1(a, b, str);

  return r && {
    start: r[0],
    end: r[1],
    pre: str.slice(0, r[0]),
    body: str.slice(r[0] + a.length, r[1]),
    post: str.slice(r[1] + b.length)
  };
}

function maybeMatch(reg, str) {
  var m = str.match(reg);
  return m ? m[0] : null;
}

balanced.range = range$1;
function range$1(a, b, str) {
  var begs, beg, left, right, result;
  var ai = str.indexOf(a);
  var bi = str.indexOf(b, ai + 1);
  var i = ai;

  if (ai >= 0 && bi > 0) {
    begs = [];
    left = str.length;

    while (i >= 0 && !result) {
      if (i == ai) {
        begs.push(i);
        ai = str.indexOf(a, i + 1);
      } else if (begs.length == 1) {
        result = [ begs.pop(), bi ];
      } else {
        beg = begs.pop();
        if (beg < left) {
          left = beg;
          right = bi;
        }

        bi = str.indexOf(b, i + 1);
      }

      i = ai < bi && ai >= 0 ? ai : bi;
    }

    if (begs.length) {
      result = [ left, right ];
    }
  }

  return result;
}

var braceExpansion = expandTop;

var escSlash = '\0SLASH'+Math.random()+'\0';
var escOpen = '\0OPEN'+Math.random()+'\0';
var escClose = '\0CLOSE'+Math.random()+'\0';
var escComma = '\0COMMA'+Math.random()+'\0';
var escPeriod = '\0PERIOD'+Math.random()+'\0';

function numeric$1(str) {
  return parseInt(str, 10) == str
    ? parseInt(str, 10)
    : str.charCodeAt(0);
}

function escapeBraces(str) {
  return str.split('\\\\').join(escSlash)
            .split('\\{').join(escOpen)
            .split('\\}').join(escClose)
            .split('\\,').join(escComma)
            .split('\\.').join(escPeriod);
}

function unescapeBraces(str) {
  return str.split(escSlash).join('\\')
            .split(escOpen).join('{')
            .split(escClose).join('}')
            .split(escComma).join(',')
            .split(escPeriod).join('.');
}


// Basically just str.split(","), but handling cases
// where we have nested braced sections, which should be
// treated as individual members, like {a,{b,c},d}
function parseCommaParts(str) {
  if (!str)
    return [''];

  var parts = [];
  var m = balancedMatch('{', '}', str);

  if (!m)
    return str.split(',');

  var pre = m.pre;
  var body = m.body;
  var post = m.post;
  var p = pre.split(',');

  p[p.length-1] += '{' + body + '}';
  var postParts = parseCommaParts(post);
  if (post.length) {
    p[p.length-1] += postParts.shift();
    p.push.apply(p, postParts);
  }

  parts.push.apply(parts, p);

  return parts;
}

function expandTop(str) {
  if (!str)
    return [];

  // I don't know why Bash 4.3 does this, but it does.
  // Anything starting with {} will have the first two bytes preserved
  // but *only* at the top level, so {},a}b will not expand to anything,
  // but a{},b}c will be expanded to [a}c,abc].
  // One could argue that this is a bug in Bash, but since the goal of
  // this module is to match Bash's rules, we escape a leading {}
  if (str.substr(0, 2) === '{}') {
    str = '\\{\\}' + str.substr(2);
  }

  return expand(escapeBraces(str), true).map(unescapeBraces);
}

function embrace(str) {
  return '{' + str + '}';
}
function isPadded(el) {
  return /^-?0\d/.test(el);
}

function lte$1(i, y) {
  return i <= y;
}
function gte$1(i, y) {
  return i >= y;
}

function expand(str, isTop) {
  var expansions = [];

  var m = balancedMatch('{', '}', str);
  if (!m || /\$$/.test(m.pre)) return [str];

  var isNumericSequence = /^-?\d+\.\.-?\d+(?:\.\.-?\d+)?$/.test(m.body);
  var isAlphaSequence = /^[a-zA-Z]\.\.[a-zA-Z](?:\.\.-?\d+)?$/.test(m.body);
  var isSequence = isNumericSequence || isAlphaSequence;
  var isOptions = m.body.indexOf(',') >= 0;
  if (!isSequence && !isOptions) {
    // {a},b}
    if (m.post.match(/,.*\}/)) {
      str = m.pre + '{' + m.body + escClose + m.post;
      return expand(str);
    }
    return [str];
  }

  var n;
  if (isSequence) {
    n = m.body.split(/\.\./);
  } else {
    n = parseCommaParts(m.body);
    if (n.length === 1) {
      // x{{a,b}}y ==> x{a}y x{b}y
      n = expand(n[0], false).map(embrace);
      if (n.length === 1) {
        var post = m.post.length
          ? expand(m.post, false)
          : [''];
        return post.map(function(p) {
          return m.pre + n[0] + p;
        });
      }
    }
  }

  // at this point, n is the parts, and we know it's not a comma set
  // with a single entry.

  // no need to expand pre, since it is guaranteed to be free of brace-sets
  var pre = m.pre;
  var post = m.post.length
    ? expand(m.post, false)
    : [''];

  var N;

  if (isSequence) {
    var x = numeric$1(n[0]);
    var y = numeric$1(n[1]);
    var width = Math.max(n[0].length, n[1].length);
    var incr = n.length == 3
      ? Math.abs(numeric$1(n[2]))
      : 1;
    var test = lte$1;
    var reverse = y < x;
    if (reverse) {
      incr *= -1;
      test = gte$1;
    }
    var pad = n.some(isPadded);

    N = [];

    for (var i = x; test(i, y); i += incr) {
      var c;
      if (isAlphaSequence) {
        c = String.fromCharCode(i);
        if (c === '\\')
          c = '';
      } else {
        c = String(i);
        if (pad) {
          var need = width - c.length;
          if (need > 0) {
            var z = new Array(need + 1).join('0');
            if (i < 0)
              c = '-' + z + c.slice(1);
            else
              c = z + c;
          }
        }
      }
      N.push(c);
    }
  } else {
    N = concatMap(n, function(el) { return expand(el, false) });
  }

  for (var j = 0; j < N.length; j++) {
    for (var k = 0; k < post.length; k++) {
      var expansion = pre + N[j] + post[k];
      if (!isTop || isSequence || expansion)
        expansions.push(expansion);
    }
  }

  return expansions;
}

var minimatch_1 = minimatch;
minimatch.Minimatch = Minimatch;

var path = { sep: '/' };
try {
  path = path__default['default'];
} catch (er) {}

var GLOBSTAR = minimatch.GLOBSTAR = Minimatch.GLOBSTAR = {};


var plTypes = {
  '!': { open: '(?:(?!(?:', close: '))[^/]*?)'},
  '?': { open: '(?:', close: ')?' },
  '+': { open: '(?:', close: ')+' },
  '*': { open: '(?:', close: ')*' },
  '@': { open: '(?:', close: ')' }
};

// any single thing other than /
// don't need to escape / when using new RegExp()
var qmark = '[^/]';

// * => any number of characters
var star = qmark + '*?';

// ** when dots are allowed.  Anything goes, except .. and .
// not (^ or / followed by one or two dots followed by $ or /),
// followed by anything, any number of times.
var twoStarDot = '(?:(?!(?:\\\/|^)(?:\\.{1,2})($|\\\/)).)*?';

// not a ^ or / followed by a dot,
// followed by anything, any number of times.
var twoStarNoDot = '(?:(?!(?:\\\/|^)\\.).)*?';

// characters that need to be escaped in RegExp.
var reSpecials = charSet('().*{}+?[]^$\\!');

// "abc" -> { a:true, b:true, c:true }
function charSet (s) {
  return s.split('').reduce(function (set, c) {
    set[c] = true;
    return set
  }, {})
}

// normalizes slashes.
var slashSplit = /\/+/;

minimatch.filter = filter;
function filter (pattern, options) {
  options = options || {};
  return function (p, i, list) {
    return minimatch(p, pattern, options)
  }
}

function ext (a, b) {
  a = a || {};
  b = b || {};
  var t = {};
  Object.keys(b).forEach(function (k) {
    t[k] = b[k];
  });
  Object.keys(a).forEach(function (k) {
    t[k] = a[k];
  });
  return t
}

minimatch.defaults = function (def) {
  if (!def || !Object.keys(def).length) return minimatch

  var orig = minimatch;

  var m = function minimatch (p, pattern, options) {
    return orig.minimatch(p, pattern, ext(def, options))
  };

  m.Minimatch = function Minimatch (pattern, options) {
    return new orig.Minimatch(pattern, ext(def, options))
  };

  return m
};

Minimatch.defaults = function (def) {
  if (!def || !Object.keys(def).length) return Minimatch
  return minimatch.defaults(def).Minimatch
};

function minimatch (p, pattern, options) {
  if (typeof pattern !== 'string') {
    throw new TypeError('glob pattern string required')
  }

  if (!options) options = {};

  // shortcut: comments match nothing.
  if (!options.nocomment && pattern.charAt(0) === '#') {
    return false
  }

  // "" only matches ""
  if (pattern.trim() === '') return p === ''

  return new Minimatch(pattern, options).match(p)
}

function Minimatch (pattern, options) {
  if (!(this instanceof Minimatch)) {
    return new Minimatch(pattern, options)
  }

  if (typeof pattern !== 'string') {
    throw new TypeError('glob pattern string required')
  }

  if (!options) options = {};
  pattern = pattern.trim();

  // windows support: need to use /, not \
  if (path.sep !== '/') {
    pattern = pattern.split(path.sep).join('/');
  }

  this.options = options;
  this.set = [];
  this.pattern = pattern;
  this.regexp = null;
  this.negate = false;
  this.comment = false;
  this.empty = false;

  // make the set of regexps etc.
  this.make();
}

Minimatch.prototype.debug = function () {};

Minimatch.prototype.make = make;
function make () {
  // don't do it more than once.
  if (this._made) return

  var pattern = this.pattern;
  var options = this.options;

  // empty patterns and comments match nothing.
  if (!options.nocomment && pattern.charAt(0) === '#') {
    this.comment = true;
    return
  }
  if (!pattern) {
    this.empty = true;
    return
  }

  // step 1: figure out negation, etc.
  this.parseNegate();

  // step 2: expand braces
  var set = this.globSet = this.braceExpand();

  if (options.debug) this.debug = console.error;

  this.debug(this.pattern, set);

  // step 3: now we have a set, so turn each one into a series of path-portion
  // matching patterns.
  // These will be regexps, except in the case of "**", which is
  // set to the GLOBSTAR object for globstar behavior,
  // and will not contain any / characters
  set = this.globParts = set.map(function (s) {
    return s.split(slashSplit)
  });

  this.debug(this.pattern, set);

  // glob --> regexps
  set = set.map(function (s, si, set) {
    return s.map(this.parse, this)
  }, this);

  this.debug(this.pattern, set);

  // filter out everything that didn't compile properly.
  set = set.filter(function (s) {
    return s.indexOf(false) === -1
  });

  this.debug(this.pattern, set);

  this.set = set;
}

Minimatch.prototype.parseNegate = parseNegate;
function parseNegate () {
  var pattern = this.pattern;
  var negate = false;
  var options = this.options;
  var negateOffset = 0;

  if (options.nonegate) return

  for (var i = 0, l = pattern.length
    ; i < l && pattern.charAt(i) === '!'
    ; i++) {
    negate = !negate;
    negateOffset++;
  }

  if (negateOffset) this.pattern = pattern.substr(negateOffset);
  this.negate = negate;
}

// Brace expansion:
// a{b,c}d -> abd acd
// a{b,}c -> abc ac
// a{0..3}d -> a0d a1d a2d a3d
// a{b,c{d,e}f}g -> abg acdfg acefg
// a{b,c}d{e,f}g -> abdeg acdeg abdeg abdfg
//
// Invalid sets are not expanded.
// a{2..}b -> a{2..}b
// a{b}c -> a{b}c
minimatch.braceExpand = function (pattern, options) {
  return braceExpand(pattern, options)
};

Minimatch.prototype.braceExpand = braceExpand;

function braceExpand (pattern, options) {
  if (!options) {
    if (this instanceof Minimatch) {
      options = this.options;
    } else {
      options = {};
    }
  }

  pattern = typeof pattern === 'undefined'
    ? this.pattern : pattern;

  if (typeof pattern === 'undefined') {
    throw new TypeError('undefined pattern')
  }

  if (options.nobrace ||
    !pattern.match(/\{.*\}/)) {
    // shortcut. no need to expand.
    return [pattern]
  }

  return braceExpansion(pattern)
}

// parse a component of the expanded set.
// At this point, no pattern may contain "/" in it
// so we're going to return a 2d array, where each entry is the full
// pattern, split on '/', and then turned into a regular expression.
// A regexp is made at the end which joins each array with an
// escaped /, and another full one which joins each regexp with |.
//
// Following the lead of Bash 4.1, note that "**" only has special meaning
// when it is the *only* thing in a path portion.  Otherwise, any series
// of * is equivalent to a single *.  Globstar behavior is enabled by
// default, and can be disabled by setting options.noglobstar.
Minimatch.prototype.parse = parse$1;
var SUBPARSE = {};
function parse$1 (pattern, isSub) {
  if (pattern.length > 1024 * 64) {
    throw new TypeError('pattern is too long')
  }

  var options = this.options;

  // shortcuts
  if (!options.noglobstar && pattern === '**') return GLOBSTAR
  if (pattern === '') return ''

  var re = '';
  var hasMagic = !!options.nocase;
  var escaping = false;
  // ? => one single character
  var patternListStack = [];
  var negativeLists = [];
  var stateChar;
  var inClass = false;
  var reClassStart = -1;
  var classStart = -1;
  // . and .. never match anything that doesn't start with .,
  // even when options.dot is set.
  var patternStart = pattern.charAt(0) === '.' ? '' // anything
  // not (start or / followed by . or .. followed by / or end)
  : options.dot ? '(?!(?:^|\\\/)\\.{1,2}(?:$|\\\/))'
  : '(?!\\.)';
  var self = this;

  function clearStateChar () {
    if (stateChar) {
      // we had some state-tracking character
      // that wasn't consumed by this pass.
      switch (stateChar) {
        case '*':
          re += star;
          hasMagic = true;
        break
        case '?':
          re += qmark;
          hasMagic = true;
        break
        default:
          re += '\\' + stateChar;
        break
      }
      self.debug('clearStateChar %j %j', stateChar, re);
      stateChar = false;
    }
  }

  for (var i = 0, len = pattern.length, c
    ; (i < len) && (c = pattern.charAt(i))
    ; i++) {
    this.debug('%s\t%s %s %j', pattern, i, re, c);

    // skip over any that are escaped.
    if (escaping && reSpecials[c]) {
      re += '\\' + c;
      escaping = false;
      continue
    }

    switch (c) {
      case '/':
        // completely not allowed, even escaped.
        // Should already be path-split by now.
        return false

      case '\\':
        clearStateChar();
        escaping = true;
      continue

      // the various stateChar values
      // for the "extglob" stuff.
      case '?':
      case '*':
      case '+':
      case '@':
      case '!':
        this.debug('%s\t%s %s %j <-- stateChar', pattern, i, re, c);

        // all of those are literals inside a class, except that
        // the glob [!a] means [^a] in regexp
        if (inClass) {
          this.debug('  in class');
          if (c === '!' && i === classStart + 1) c = '^';
          re += c;
          continue
        }

        // if we already have a stateChar, then it means
        // that there was something like ** or +? in there.
        // Handle the stateChar, then proceed with this one.
        self.debug('call clearStateChar %j', stateChar);
        clearStateChar();
        stateChar = c;
        // if extglob is disabled, then +(asdf|foo) isn't a thing.
        // just clear the statechar *now*, rather than even diving into
        // the patternList stuff.
        if (options.noext) clearStateChar();
      continue

      case '(':
        if (inClass) {
          re += '(';
          continue
        }

        if (!stateChar) {
          re += '\\(';
          continue
        }

        patternListStack.push({
          type: stateChar,
          start: i - 1,
          reStart: re.length,
          open: plTypes[stateChar].open,
          close: plTypes[stateChar].close
        });
        // negation is (?:(?!js)[^/]*)
        re += stateChar === '!' ? '(?:(?!(?:' : '(?:';
        this.debug('plType %j %j', stateChar, re);
        stateChar = false;
      continue

      case ')':
        if (inClass || !patternListStack.length) {
          re += '\\)';
          continue
        }

        clearStateChar();
        hasMagic = true;
        var pl = patternListStack.pop();
        // negation is (?:(?!js)[^/]*)
        // The others are (?:<pattern>)<type>
        re += pl.close;
        if (pl.type === '!') {
          negativeLists.push(pl);
        }
        pl.reEnd = re.length;
      continue

      case '|':
        if (inClass || !patternListStack.length || escaping) {
          re += '\\|';
          escaping = false;
          continue
        }

        clearStateChar();
        re += '|';
      continue

      // these are mostly the same in regexp and glob
      case '[':
        // swallow any state-tracking char before the [
        clearStateChar();

        if (inClass) {
          re += '\\' + c;
          continue
        }

        inClass = true;
        classStart = i;
        reClassStart = re.length;
        re += c;
      continue

      case ']':
        //  a right bracket shall lose its special
        //  meaning and represent itself in
        //  a bracket expression if it occurs
        //  first in the list.  -- POSIX.2 2.8.3.2
        if (i === classStart + 1 || !inClass) {
          re += '\\' + c;
          escaping = false;
          continue
        }

        // handle the case where we left a class open.
        // "[z-a]" is valid, equivalent to "\[z-a\]"
        if (inClass) {
          // split where the last [ was, make sure we don't have
          // an invalid re. if so, re-walk the contents of the
          // would-be class to re-translate any characters that
          // were passed through as-is
          // TODO: It would probably be faster to determine this
          // without a try/catch and a new RegExp, but it's tricky
          // to do safely.  For now, this is safe and works.
          var cs = pattern.substring(classStart + 1, i);
          try {
            RegExp('[' + cs + ']');
          } catch (er) {
            // not a valid class!
            var sp = this.parse(cs, SUBPARSE);
            re = re.substr(0, reClassStart) + '\\[' + sp[0] + '\\]';
            hasMagic = hasMagic || sp[1];
            inClass = false;
            continue
          }
        }

        // finish up the class.
        hasMagic = true;
        inClass = false;
        re += c;
      continue

      default:
        // swallow any state char that wasn't consumed
        clearStateChar();

        if (escaping) {
          // no need
          escaping = false;
        } else if (reSpecials[c]
          && !(c === '^' && inClass)) {
          re += '\\';
        }

        re += c;

    } // switch
  } // for

  // handle the case where we left a class open.
  // "[abc" is valid, equivalent to "\[abc"
  if (inClass) {
    // split where the last [ was, and escape it
    // this is a huge pita.  We now have to re-walk
    // the contents of the would-be class to re-translate
    // any characters that were passed through as-is
    cs = pattern.substr(classStart + 1);
    sp = this.parse(cs, SUBPARSE);
    re = re.substr(0, reClassStart) + '\\[' + sp[0];
    hasMagic = hasMagic || sp[1];
  }

  // handle the case where we had a +( thing at the *end*
  // of the pattern.
  // each pattern list stack adds 3 chars, and we need to go through
  // and escape any | chars that were passed through as-is for the regexp.
  // Go through and escape them, taking care not to double-escape any
  // | chars that were already escaped.
  for (pl = patternListStack.pop(); pl; pl = patternListStack.pop()) {
    var tail = re.slice(pl.reStart + pl.open.length);
    this.debug('setting tail', re, pl);
    // maybe some even number of \, then maybe 1 \, followed by a |
    tail = tail.replace(/((?:\\{2}){0,64})(\\?)\|/g, function (_, $1, $2) {
      if (!$2) {
        // the | isn't already escaped, so escape it.
        $2 = '\\';
      }

      // need to escape all those slashes *again*, without escaping the
      // one that we need for escaping the | character.  As it works out,
      // escaping an even number of slashes can be done by simply repeating
      // it exactly after itself.  That's why this trick works.
      //
      // I am sorry that you have to see this.
      return $1 + $1 + $2 + '|'
    });

    this.debug('tail=%j\n   %s', tail, tail, pl, re);
    var t = pl.type === '*' ? star
      : pl.type === '?' ? qmark
      : '\\' + pl.type;

    hasMagic = true;
    re = re.slice(0, pl.reStart) + t + '\\(' + tail;
  }

  // handle trailing things that only matter at the very end.
  clearStateChar();
  if (escaping) {
    // trailing \\
    re += '\\\\';
  }

  // only need to apply the nodot start if the re starts with
  // something that could conceivably capture a dot
  var addPatternStart = false;
  switch (re.charAt(0)) {
    case '.':
    case '[':
    case '(': addPatternStart = true;
  }

  // Hack to work around lack of negative lookbehind in JS
  // A pattern like: *.!(x).!(y|z) needs to ensure that a name
  // like 'a.xyz.yz' doesn't match.  So, the first negative
  // lookahead, has to look ALL the way ahead, to the end of
  // the pattern.
  for (var n = negativeLists.length - 1; n > -1; n--) {
    var nl = negativeLists[n];

    var nlBefore = re.slice(0, nl.reStart);
    var nlFirst = re.slice(nl.reStart, nl.reEnd - 8);
    var nlLast = re.slice(nl.reEnd - 8, nl.reEnd);
    var nlAfter = re.slice(nl.reEnd);

    nlLast += nlAfter;

    // Handle nested stuff like *(*.js|!(*.json)), where open parens
    // mean that we should *not* include the ) in the bit that is considered
    // "after" the negated section.
    var openParensBefore = nlBefore.split('(').length - 1;
    var cleanAfter = nlAfter;
    for (i = 0; i < openParensBefore; i++) {
      cleanAfter = cleanAfter.replace(/\)[+*?]?/, '');
    }
    nlAfter = cleanAfter;

    var dollar = '';
    if (nlAfter === '' && isSub !== SUBPARSE) {
      dollar = '$';
    }
    var newRe = nlBefore + nlFirst + nlAfter + dollar + nlLast;
    re = newRe;
  }

  // if the re is not "" at this point, then we need to make sure
  // it doesn't match against an empty path part.
  // Otherwise a/* will match a/, which it should not.
  if (re !== '' && hasMagic) {
    re = '(?=.)' + re;
  }

  if (addPatternStart) {
    re = patternStart + re;
  }

  // parsing just a piece of a larger pattern.
  if (isSub === SUBPARSE) {
    return [re, hasMagic]
  }

  // skip the regexp for non-magical patterns
  // unescape anything in it, though, so that it'll be
  // an exact match against a file etc.
  if (!hasMagic) {
    return globUnescape(pattern)
  }

  var flags = options.nocase ? 'i' : '';
  try {
    var regExp = new RegExp('^' + re + '$', flags);
  } catch (er) {
    // If it was an invalid regular expression, then it can't match
    // anything.  This trick looks for a character after the end of
    // the string, which is of course impossible, except in multi-line
    // mode, but it's not a /m regex.
    return new RegExp('$.')
  }

  regExp._glob = pattern;
  regExp._src = re;

  return regExp
}

minimatch.makeRe = function (pattern, options) {
  return new Minimatch(pattern, options || {}).makeRe()
};

Minimatch.prototype.makeRe = makeRe;
function makeRe () {
  if (this.regexp || this.regexp === false) return this.regexp

  // at this point, this.set is a 2d array of partial
  // pattern strings, or "**".
  //
  // It's better to use .match().  This function shouldn't
  // be used, really, but it's pretty convenient sometimes,
  // when you just want to work with a regex.
  var set = this.set;

  if (!set.length) {
    this.regexp = false;
    return this.regexp
  }
  var options = this.options;

  var twoStar = options.noglobstar ? star
    : options.dot ? twoStarDot
    : twoStarNoDot;
  var flags = options.nocase ? 'i' : '';

  var re = set.map(function (pattern) {
    return pattern.map(function (p) {
      return (p === GLOBSTAR) ? twoStar
      : (typeof p === 'string') ? regExpEscape(p)
      : p._src
    }).join('\\\/')
  }).join('|');

  // must match entire pattern
  // ending in a * or ** will make it less strict.
  re = '^(?:' + re + ')$';

  // can match anything, as long as it's not this.
  if (this.negate) re = '^(?!' + re + ').*$';

  try {
    this.regexp = new RegExp(re, flags);
  } catch (ex) {
    this.regexp = false;
  }
  return this.regexp
}

minimatch.match = function (list, pattern, options) {
  options = options || {};
  var mm = new Minimatch(pattern, options);
  list = list.filter(function (f) {
    return mm.match(f)
  });
  if (mm.options.nonull && !list.length) {
    list.push(pattern);
  }
  return list
};

Minimatch.prototype.match = match;
function match (f, partial) {
  this.debug('match', f, this.pattern);
  // short-circuit in the case of busted things.
  // comments, etc.
  if (this.comment) return false
  if (this.empty) return f === ''

  if (f === '/' && partial) return true

  var options = this.options;

  // windows: need to use /, not \
  if (path.sep !== '/') {
    f = f.split(path.sep).join('/');
  }

  // treat the test path as a set of pathparts.
  f = f.split(slashSplit);
  this.debug(this.pattern, 'split', f);

  // just ONE of the pattern sets in this.set needs to match
  // in order for it to be valid.  If negating, then just one
  // match means that we have failed.
  // Either way, return on the first hit.

  var set = this.set;
  this.debug(this.pattern, 'set', set);

  // Find the basename of the path by looking for the last non-empty segment
  var filename;
  var i;
  for (i = f.length - 1; i >= 0; i--) {
    filename = f[i];
    if (filename) break
  }

  for (i = 0; i < set.length; i++) {
    var pattern = set[i];
    var file = f;
    if (options.matchBase && pattern.length === 1) {
      file = [filename];
    }
    var hit = this.matchOne(file, pattern, partial);
    if (hit) {
      if (options.flipNegate) return true
      return !this.negate
    }
  }

  // didn't get any hits.  this is success if it's a negative
  // pattern, failure otherwise.
  if (options.flipNegate) return false
  return this.negate
}

// set partial to true to test if, for example,
// "/a/b" matches the start of "/*/b/*/d"
// Partial means, if you run out of file before you run
// out of pattern, then that's fine, as long as all
// the parts match.
Minimatch.prototype.matchOne = function (file, pattern, partial) {
  var options = this.options;

  this.debug('matchOne',
    { 'this': this, file: file, pattern: pattern });

  this.debug('matchOne', file.length, pattern.length);

  for (var fi = 0,
      pi = 0,
      fl = file.length,
      pl = pattern.length
      ; (fi < fl) && (pi < pl)
      ; fi++, pi++) {
    this.debug('matchOne loop');
    var p = pattern[pi];
    var f = file[fi];

    this.debug(pattern, p, f);

    // should be impossible.
    // some invalid regexp stuff in the set.
    if (p === false) return false

    if (p === GLOBSTAR) {
      this.debug('GLOBSTAR', [pattern, p, f]);

      // "**"
      // a/**/b/**/c would match the following:
      // a/b/x/y/z/c
      // a/x/y/z/b/c
      // a/b/x/b/x/c
      // a/b/c
      // To do this, take the rest of the pattern after
      // the **, and see if it would match the file remainder.
      // If so, return success.
      // If not, the ** "swallows" a segment, and try again.
      // This is recursively awful.
      //
      // a/**/b/**/c matching a/b/x/y/z/c
      // - a matches a
      // - doublestar
      //   - matchOne(b/x/y/z/c, b/**/c)
      //     - b matches b
      //     - doublestar
      //       - matchOne(x/y/z/c, c) -> no
      //       - matchOne(y/z/c, c) -> no
      //       - matchOne(z/c, c) -> no
      //       - matchOne(c, c) yes, hit
      var fr = fi;
      var pr = pi + 1;
      if (pr === pl) {
        this.debug('** at the end');
        // a ** at the end will just swallow the rest.
        // We have found a match.
        // however, it will not swallow /.x, unless
        // options.dot is set.
        // . and .. are *never* matched by **, for explosively
        // exponential reasons.
        for (; fi < fl; fi++) {
          if (file[fi] === '.' || file[fi] === '..' ||
            (!options.dot && file[fi].charAt(0) === '.')) return false
        }
        return true
      }

      // ok, let's see if we can swallow whatever we can.
      while (fr < fl) {
        var swallowee = file[fr];

        this.debug('\nglobstar while', file, fr, pattern, pr, swallowee);

        // XXX remove this slice.  Just pass the start index.
        if (this.matchOne(file.slice(fr), pattern.slice(pr), partial)) {
          this.debug('globstar found match!', fr, fl, swallowee);
          // found a match.
          return true
        } else {
          // can't swallow "." or ".." ever.
          // can only swallow ".foo" when explicitly asked.
          if (swallowee === '.' || swallowee === '..' ||
            (!options.dot && swallowee.charAt(0) === '.')) {
            this.debug('dot detected!', file, fr, pattern, pr);
            break
          }

          // ** swallows a segment, and continue.
          this.debug('globstar swallow a segment, and continue');
          fr++;
        }
      }

      // no match was found.
      // However, in partial mode, we can't say this is necessarily over.
      // If there's more *pattern* left, then
      if (partial) {
        // ran out of file
        this.debug('\n>>> no match, partial?', file, fr, pattern, pr);
        if (fr === fl) return true
      }
      return false
    }

    // something other than **
    // non-magic patterns just have to match exactly
    // patterns with magic have been turned into regexps.
    var hit;
    if (typeof p === 'string') {
      if (options.nocase) {
        hit = f.toLowerCase() === p.toLowerCase();
      } else {
        hit = f === p;
      }
      this.debug('string match', p, f, hit);
    } else {
      hit = f.match(p);
      this.debug('pattern match', p, f, hit);
    }

    if (!hit) return false
  }

  // Note: ending in / means that we'll get a final ""
  // at the end of the pattern.  This can only match a
  // corresponding "" at the end of the file.
  // If the file ends in /, then it can only match a
  // a pattern that ends in /, unless the pattern just
  // doesn't have any more for it. But, a/b/ should *not*
  // match "a/b/*", even though "" matches against the
  // [^/]*? pattern, except in partial mode, where it might
  // simply not be reached yet.
  // However, a/b/ should still satisfy a/*

  // now either we fell off the end of the pattern, or we're done.
  if (fi === fl && pi === pl) {
    // ran out of pattern and filename at the same time.
    // an exact hit!
    return true
  } else if (fi === fl) {
    // ran out of file, but still had pattern left.
    // this is ok if we're doing the match as part of
    // a glob fs traversal.
    return partial
  } else if (pi === pl) {
    // ran out of pattern, still have file left.
    // this is only acceptable if we're on the very last
    // empty segment of a file with a trailing slash.
    // a/* should match a/b/
    var emptyFileEnd = (fi === fl - 1) && (file[fi] === '');
    return emptyFileEnd
  }

  // should be unreachable.
  throw new Error('wtf?')
};

// replace stuff like \* with *
function globUnescape (s) {
  return s.replace(/\\(.)/g, '$1')
}

function regExpEscape (s) {
  return s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
}

var fileOperations = createCommonjsModule(function (module, exports) {
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
Object.defineProperty(exports, "__esModule", { value: true });
exports.WillDeleteFilesFeature = exports.WillRenameFilesFeature = exports.WillCreateFilesFeature = exports.DidDeleteFilesFeature = exports.DidRenameFilesFeature = exports.DidCreateFilesFeature = void 0;




function ensure(target, key) {
    if (target[key] === void 0) {
        target[key] = {};
    }
    return target[key];
}
function access(target, key) {
    return target[key];
}
function assign(target, key, value) {
    target[key] = value;
}
class FileOperationFeature {
    constructor(client, event, registrationType, clientCapability, serverCapability) {
        this._filters = new Map();
        this._client = client;
        this._event = event;
        this._registrationType = registrationType;
        this._clientCapability = clientCapability;
        this._serverCapability = serverCapability;
    }
    get registrationType() {
        return this._registrationType;
    }
    fillClientCapabilities(capabilities) {
        const value = ensure(ensure(capabilities, 'workspace'), 'fileOperations');
        // this happens n times but it is the same value so we tolerate this.
        assign(value, 'dynamicRegistration', true);
        assign(value, this._clientCapability, true);
    }
    initialize(capabilities) {
        var _a;
        const options = (_a = capabilities.workspace) === null || _a === void 0 ? void 0 : _a.fileOperations;
        const capability = options !== undefined ? access(options, this._serverCapability) : undefined;
        if ((capability === null || capability === void 0 ? void 0 : capability.filters) !== undefined) {
            try {
                this.register({
                    id: uuid.generateUuid(),
                    registerOptions: { filters: capability.filters }
                });
            }
            catch (e) {
                this._client.warn(`Ignoring invalid glob pattern for ${this._serverCapability} registration: ${e}`);
            }
        }
    }
    register(data) {
        if (!this._listener) {
            this._listener = this._event(this.send, this);
        }
        const minimatchFilter = data.registerOptions.filters.map((filter) => {
            const matcher = new minimatch_1.Minimatch(filter.pattern.glob, FileOperationFeature.asMinimatchOptions(filter.pattern.options));
            if (!matcher.makeRe()) {
                throw new Error(`Invalid pattern ${filter.pattern.glob}!`);
            }
            return { scheme: filter.scheme, matcher, kind: filter.pattern.matches };
        });
        this._filters.set(data.id, minimatchFilter);
    }
    unregister(id) {
        this._filters.delete(id);
        if (this._filters.size === 0 && this._listener) {
            this._listener.dispose();
            this._listener = undefined;
        }
    }
    dispose() {
        this._filters.clear();
        if (this._listener) {
            this._listener.dispose();
            this._listener = undefined;
        }
    }
    async filter(event, prop) {
        // (Asynchronously) map each file onto a boolean of whether it matches
        // any of the globs.
        const fileMatches = await Promise.all(event.files.map(async (item) => {
            const uri = prop(item);
            // Use fsPath to make this consistent with file system watchers but help
            // minimatch to use '/' instead of `\\` if present.
            const path = uri.fsPath.replace(/\\/g, '/');
            for (const filters of this._filters.values()) {
                for (const filter of filters) {
                    if (filter.scheme !== undefined && filter.scheme !== uri.scheme) {
                        continue;
                    }
                    if (filter.matcher.match(path)) {
                        // The pattern matches. If kind is undefined then everything is ok
                        if (filter.kind === undefined) {
                            return true;
                        }
                        const fileType = await FileOperationFeature.getFileType(uri);
                        // If we can't determine the file type than we treat it as a match.
                        // Dropping it would be another alternative.
                        if (fileType === undefined) {
                            this._client.error(`Failed to determine file type for ${uri.toString()}.`);
                            return true;
                        }
                        if ((fileType === vscode__default['default'].FileType.File && filter.kind === main$2.FileOperationPatternKind.file) || (fileType === vscode__default['default'].FileType.Directory && filter.kind === main$2.FileOperationPatternKind.folder)) {
                            return true;
                        }
                    }
                    else if (filter.kind === main$2.FileOperationPatternKind.folder) {
                        const fileType = await FileOperationFeature.getFileType(uri);
                        if (fileType === vscode__default['default'].FileType.Directory && filter.matcher.match(`${path}/`)) {
                            return true;
                        }
                    }
                }
            }
            return false;
        }));
        // Filter the files to those that matched.
        const files = event.files.filter((_, index) => fileMatches[index]);
        return Object.assign(Object.assign({}, event), { files });
    }
    static async getFileType(uri) {
        try {
            return (await vscode__default['default'].workspace.fs.stat(uri)).type;
        }
        catch (e) {
            return undefined;
        }
    }
    static asMinimatchOptions(options) {
        if (options === undefined) {
            return undefined;
        }
        if (options.ignoreCase === true) {
            return { nocase: true };
        }
        return undefined;
    }
}
class NotificationFileOperationFeature extends FileOperationFeature {
    constructor(client, event, notificationType, clientCapability, serverCapability, accessUri, createParams) {
        super(client, event, notificationType, clientCapability, serverCapability);
        this._notificationType = notificationType;
        this._accessUri = accessUri;
        this._createParams = createParams;
    }
    async send(originalEvent) {
        // Create a copy of the event that has the files filtered to match what the
        // server wants.
        const filteredEvent = await this.filter(originalEvent, this._accessUri);
        if (filteredEvent.files.length) {
            const next = async (event) => {
                this._client.sendNotification(this._notificationType, this._createParams(event));
            };
            this.doSend(filteredEvent, next);
        }
    }
}
class DidCreateFilesFeature extends NotificationFileOperationFeature {
    constructor(client) {
        super(client, vscode__default['default'].workspace.onDidCreateFiles, main$2.DidCreateFilesNotification.type, 'didCreate', 'didCreate', (i) => i, client.code2ProtocolConverter.asDidCreateFilesParams);
    }
    doSend(event, next) {
        var _a;
        const middleware = (_a = this._client.clientOptions.middleware) === null || _a === void 0 ? void 0 : _a.workspace;
        return (middleware === null || middleware === void 0 ? void 0 : middleware.didCreateFiles) ? middleware.didCreateFiles(event, next)
            : next(event);
    }
}
exports.DidCreateFilesFeature = DidCreateFilesFeature;
class DidRenameFilesFeature extends NotificationFileOperationFeature {
    constructor(client) {
        super(client, vscode__default['default'].workspace.onDidRenameFiles, main$2.DidRenameFilesNotification.type, 'didRename', 'didRename', (i) => i.oldUri, client.code2ProtocolConverter.asDidRenameFilesParams);
    }
    doSend(event, next) {
        var _a;
        const middleware = (_a = this._client.clientOptions.middleware) === null || _a === void 0 ? void 0 : _a.workspace;
        return (middleware === null || middleware === void 0 ? void 0 : middleware.didRenameFiles) ? middleware.didRenameFiles(event, next)
            : next(event);
    }
}
exports.DidRenameFilesFeature = DidRenameFilesFeature;
class DidDeleteFilesFeature extends NotificationFileOperationFeature {
    constructor(client) {
        super(client, vscode__default['default'].workspace.onDidDeleteFiles, main$2.DidDeleteFilesNotification.type, 'didDelete', 'didDelete', (i) => i, client.code2ProtocolConverter.asDidDeleteFilesParams);
    }
    doSend(event, next) {
        var _a;
        const middleware = (_a = this._client.clientOptions.middleware) === null || _a === void 0 ? void 0 : _a.workspace;
        return (middleware === null || middleware === void 0 ? void 0 : middleware.didDeleteFiles) ? middleware.didDeleteFiles(event, next)
            : next(event);
    }
}
exports.DidDeleteFilesFeature = DidDeleteFilesFeature;
class RequestFileOperationFeature extends FileOperationFeature {
    constructor(client, event, requestType, clientCapability, serverCapability, accessUri, createParams) {
        super(client, event, requestType, clientCapability, serverCapability);
        this._requestType = requestType;
        this._accessUri = accessUri;
        this._createParams = createParams;
    }
    async send(originalEvent) {
        const waitUntil = this.waitUntil(originalEvent);
        originalEvent.waitUntil(waitUntil);
    }
    async waitUntil(originalEvent) {
        // Create a copy of the event that has the files filtered to match what the
        // server wants.
        const filteredEvent = await this.filter(originalEvent, this._accessUri);
        if (filteredEvent.files.length) {
            const next = (event) => {
                return this._client.sendRequest(this._requestType, this._createParams(event))
                    .then(this._client.protocol2CodeConverter.asWorkspaceEdit);
            };
            return this.doSend(filteredEvent, next);
        }
        else {
            return undefined;
        }
    }
}
class WillCreateFilesFeature extends RequestFileOperationFeature {
    constructor(client) {
        super(client, vscode__default['default'].workspace.onWillCreateFiles, main$2.WillCreateFilesRequest.type, 'willCreate', 'willCreate', (i) => i, client.code2ProtocolConverter.asWillCreateFilesParams);
    }
    doSend(event, next) {
        var _a;
        const middleware = (_a = this._client.clientOptions.middleware) === null || _a === void 0 ? void 0 : _a.workspace;
        return (middleware === null || middleware === void 0 ? void 0 : middleware.willCreateFiles) ? middleware.willCreateFiles(event, next)
            : next(event);
    }
}
exports.WillCreateFilesFeature = WillCreateFilesFeature;
class WillRenameFilesFeature extends RequestFileOperationFeature {
    constructor(client) {
        super(client, vscode__default['default'].workspace.onWillRenameFiles, main$2.WillRenameFilesRequest.type, 'willRename', 'willRename', (i) => i.oldUri, client.code2ProtocolConverter.asWillRenameFilesParams);
    }
    doSend(event, next) {
        var _a;
        const middleware = (_a = this._client.clientOptions.middleware) === null || _a === void 0 ? void 0 : _a.workspace;
        return (middleware === null || middleware === void 0 ? void 0 : middleware.willRenameFiles) ? middleware.willRenameFiles(event, next)
            : next(event);
    }
}
exports.WillRenameFilesFeature = WillRenameFilesFeature;
class WillDeleteFilesFeature extends RequestFileOperationFeature {
    constructor(client) {
        super(client, vscode__default['default'].workspace.onWillDeleteFiles, main$2.WillDeleteFilesRequest.type, 'willDelete', 'willDelete', (i) => i, client.code2ProtocolConverter.asWillDeleteFilesParams);
    }
    doSend(event, next) {
        var _a;
        const middleware = (_a = this._client.clientOptions.middleware) === null || _a === void 0 ? void 0 : _a.workspace;
        return (middleware === null || middleware === void 0 ? void 0 : middleware.willDeleteFiles) ? middleware.willDeleteFiles(event, next)
            : next(event);
    }
}
exports.WillDeleteFilesFeature = WillDeleteFilesFeature;

});

var linkedEditingRange = createCommonjsModule(function (module, exports) {
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
/// <reference path="../../typings/vscode-proposed.d.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinkedEditingFeature = void 0;



function ensure(target, key) {
    if (target[key] === void 0) {
        target[key] = {};
    }
    return target[key];
}
class LinkedEditingFeature extends client.TextDocumentFeature {
    constructor(client) {
        super(client, main$2.LinkedEditingRangeRequest.type);
    }
    fillClientCapabilities(capabilities) {
        const linkedEditingSupport = ensure(ensure(capabilities, 'textDocument'), 'linkedEditingRange');
        linkedEditingSupport.dynamicRegistration = true;
    }
    initialize(capabilities, documentSelector) {
        let [id, options] = this.getRegistration(documentSelector, capabilities.linkedEditingRangeProvider);
        if (!id || !options) {
            return;
        }
        this.register({ id: id, registerOptions: options });
    }
    registerLanguageProvider(options) {
        const provider = {
            provideLinkedEditingRanges: (document, position, token) => {
                const client = this._client;
                const provideLinkedEditing = (document, position, token) => {
                    return client.sendRequest(main$2.LinkedEditingRangeRequest.type, client.code2ProtocolConverter.asTextDocumentPositionParams(document, position), token).then(client.protocol2CodeConverter.asLinkedEditingRanges, (error) => {
                        return client.handleFailedRequest(main$2.LinkedEditingRangeRequest.type, error, null);
                    });
                };
                const middleware = client.clientOptions.middleware;
                return middleware.provideLinkedEditingRange
                    ? middleware.provideLinkedEditingRange(document, position, token, provideLinkedEditing)
                    : provideLinkedEditing(document, position, token);
            }
        };
        return [vscode__default['default'].languages.registerLinkedEditingRangeProvider(options.documentSelector, provider), provider];
    }
}
exports.LinkedEditingFeature = LinkedEditingFeature;

});

var commonClient = createCommonjsModule(function (module, exports) {
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProposedFeatures = exports.CommonLanguageClient = void 0;














class CommonLanguageClient extends client.BaseLanguageClient {
    constructor(id, name, clientOptions) {
        super(id, name, clientOptions);
    }
    registerProposedFeatures() {
        this.registerFeatures(ProposedFeatures.createAll(this));
    }
    registerBuiltinFeatures() {
        super.registerBuiltinFeatures();
        this.registerFeature(new configuration.ConfigurationFeature(this));
        this.registerFeature(new typeDefinition.TypeDefinitionFeature(this));
        this.registerFeature(new implementation.ImplementationFeature(this));
        this.registerFeature(new colorProvider.ColorProviderFeature(this));
        this.registerFeature(new workspaceFolders.WorkspaceFoldersFeature(this));
        this.registerFeature(new foldingRange.FoldingRangeFeature(this));
        this.registerFeature(new declaration.DeclarationFeature(this));
        this.registerFeature(new selectionRange.SelectionRangeFeature(this));
        this.registerFeature(new progress.ProgressFeature(this));
        this.registerFeature(new callHierarchy.CallHierarchyFeature(this));
        this.registerFeature(new semanticTokens.SemanticTokensFeature(this));
        this.registerFeature(new linkedEditingRange.LinkedEditingFeature(this));
        this.registerFeature(new fileOperations.DidCreateFilesFeature(this));
        this.registerFeature(new fileOperations.DidRenameFilesFeature(this));
        this.registerFeature(new fileOperations.DidDeleteFilesFeature(this));
        this.registerFeature(new fileOperations.WillCreateFilesFeature(this));
        this.registerFeature(new fileOperations.WillRenameFilesFeature(this));
        this.registerFeature(new fileOperations.WillDeleteFilesFeature(this));
    }
}
exports.CommonLanguageClient = CommonLanguageClient;
// Exporting proposed protocol.
var ProposedFeatures;
(function (ProposedFeatures) {
    function createAll(_client) {
        let result = [];
        return result;
    }
    ProposedFeatures.createAll = createAll;
})(ProposedFeatures = exports.ProposedFeatures || (exports.ProposedFeatures = {}));

});

var processes = createCommonjsModule(function (module, exports) {
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
Object.defineProperty(exports, "__esModule", { value: true });
exports.terminate = void 0;


const isWindows = (process.platform === 'win32');
const isMacintosh = (process.platform === 'darwin');
const isLinux = (process.platform === 'linux');
function terminate(process, cwd) {
    if (isWindows) {
        try {
            // This we run in Atom execFileSync is available.
            // Ignore stderr since this is otherwise piped to parent.stderr
            // which might be already closed.
            let options = {
                stdio: ['pipe', 'pipe', 'ignore']
            };
            if (cwd) {
                options.cwd = cwd;
            }
            cp__default['default'].execFileSync('taskkill', ['/T', '/F', '/PID', process.pid.toString()], options);
            return true;
        }
        catch (err) {
            return false;
        }
    }
    else if (isLinux || isMacintosh) {
        try {
            var cmd = path__default['default'].join(__dirname, 'terminateProcess.sh');
            var result = cp__default['default'].spawnSync(cmd, [process.pid.toString()]);
            return result.error ? false : true;
        }
        catch (err) {
            return false;
        }
    }
    else {
        process.kill('SIGKILL');
        return true;
    }
}
exports.terminate = terminate;

});

/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ----------------------------------------------------------------------------------------- */

var node$1 = main$2;

var api$2 = createCommonjsModule(function (module, exports) {
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (commonjsGlobal && commonjsGlobal.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(main$2, exports);
__exportStar(client, exports);
__exportStar(commonClient, exports);

});

var main$3 = createCommonjsModule(function (module, exports) {
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (commonjsGlobal && commonjsGlobal.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingMonitor = exports.LanguageClient = exports.TransportKind = void 0;
const cp = cp__default['default'];









__exportStar(node$1, exports);
__exportStar(api$2, exports);
const REQUIRED_VSCODE_VERSION = '^1.52.0'; // do not change format, updated by `updateVSCode` script
var Executable;
(function (Executable) {
    function is$1(value) {
        return is.string(value.command);
    }
    Executable.is = is$1;
})(Executable || (Executable = {}));
var TransportKind;
(function (TransportKind) {
    TransportKind[TransportKind["stdio"] = 0] = "stdio";
    TransportKind[TransportKind["ipc"] = 1] = "ipc";
    TransportKind[TransportKind["pipe"] = 2] = "pipe";
    TransportKind[TransportKind["socket"] = 3] = "socket";
})(TransportKind = exports.TransportKind || (exports.TransportKind = {}));
var Transport;
(function (Transport) {
    function isSocket(value) {
        let candidate = value;
        return candidate && candidate.kind === TransportKind.socket && is.number(candidate.port);
    }
    Transport.isSocket = isSocket;
})(Transport || (Transport = {}));
var NodeModule;
(function (NodeModule) {
    function is$1(value) {
        return is.string(value.module);
    }
    NodeModule.is = is$1;
})(NodeModule || (NodeModule = {}));
var StreamInfo;
(function (StreamInfo) {
    function is(value) {
        let candidate = value;
        return candidate && candidate.writer !== void 0 && candidate.reader !== void 0;
    }
    StreamInfo.is = is;
})(StreamInfo || (StreamInfo = {}));
var ChildProcessInfo;
(function (ChildProcessInfo) {
    function is(value) {
        let candidate = value;
        return candidate && candidate.process !== void 0 && typeof candidate.detached === 'boolean';
    }
    ChildProcessInfo.is = is;
})(ChildProcessInfo || (ChildProcessInfo = {}));
class LanguageClient extends commonClient.CommonLanguageClient {
    constructor(arg1, arg2, arg3, arg4, arg5) {
        let id;
        let name;
        let serverOptions;
        let clientOptions;
        let forceDebug;
        if (is.string(arg2)) {
            id = arg1;
            name = arg2;
            serverOptions = arg3;
            clientOptions = arg4;
            forceDebug = !!arg5;
        }
        else {
            id = arg1.toLowerCase();
            name = arg1;
            serverOptions = arg2;
            clientOptions = arg3;
            forceDebug = arg4;
        }
        if (forceDebug === void 0) {
            forceDebug = false;
        }
        super(id, name, clientOptions);
        this._serverOptions = serverOptions;
        this._forceDebug = forceDebug;
        try {
            this.checkVersion();
        }
        catch (error) {
            if (is.string(error.message)) {
                this.outputChannel.appendLine(error.message);
            }
            throw error;
        }
    }
    checkVersion() {
        let codeVersion = semver$1.parse(vscode__default['default'].version);
        if (!codeVersion) {
            throw new Error(`No valid VS Code version detected. Version string is: ${vscode__default['default'].version}`);
        }
        // Remove the insider pre-release since we stay API compatible.
        if (codeVersion.prerelease && codeVersion.prerelease.length > 0) {
            codeVersion.prerelease = [];
        }
        if (!semver$1.satisfies(codeVersion, REQUIRED_VSCODE_VERSION)) {
            throw new Error(`The language client requires VS Code version ${REQUIRED_VSCODE_VERSION} but received version ${vscode__default['default'].version}`);
        }
    }
    stop() {
        return super.stop().then(() => {
            if (this._serverProcess) {
                let toCheck = this._serverProcess;
                this._serverProcess = undefined;
                if (this._isDetached === void 0 || !this._isDetached) {
                    this.checkProcessDied(toCheck);
                }
                this._isDetached = undefined;
            }
        });
    }
    checkProcessDied(childProcess) {
        if (!childProcess) {
            return;
        }
        setTimeout(() => {
            // Test if the process is still alive. Throws an exception if not
            try {
                process.kill(childProcess.pid, 0);
                processes.terminate(childProcess);
            }
            catch (error) {
                // All is fine.
            }
        }, 2000);
    }
    handleConnectionClosed() {
        this._serverProcess = undefined;
        super.handleConnectionClosed();
    }
    fillInitializeParams(params) {
        super.fillInitializeParams(params);
        if (params.processId === null) {
            params.processId = process.pid;
        }
    }
    createMessageTransports(encoding) {
        function getEnvironment(env, fork) {
            if (!env && !fork) {
                return undefined;
            }
            let result = Object.create(null);
            Object.keys(process.env).forEach(key => result[key] = process.env[key]);
            if (fork) {
                result['ELECTRON_RUN_AS_NODE'] = '1';
                result['ELECTRON_NO_ASAR'] = '1';
            }
            if (env) {
                Object.keys(env).forEach(key => result[key] = env[key]);
            }
            return result;
        }
        const debugStartWith = ['--debug=', '--debug-brk=', '--inspect=', '--inspect-brk='];
        const debugEquals = ['--debug', '--debug-brk', '--inspect', '--inspect-brk'];
        function startedInDebugMode() {
            let args = process.execArgv;
            if (args) {
                return args.some((arg) => {
                    return debugStartWith.some(value => arg.startsWith(value)) ||
                        debugEquals.some(value => arg === value);
                });
            }
            return false;
        }
        function assertStdio(process) {
            if (process.stdin === null || process.stdout === null || process.stderr === null) {
                throw new Error('Process created without stdio streams');
            }
        }
        let server = this._serverOptions;
        // We got a function.
        if (is.func(server)) {
            return server().then((result) => {
                if (client.MessageTransports.is(result)) {
                    this._isDetached = !!result.detached;
                    return result;
                }
                else if (StreamInfo.is(result)) {
                    this._isDetached = !!result.detached;
                    return { reader: new node$1.StreamMessageReader(result.reader), writer: new node$1.StreamMessageWriter(result.writer) };
                }
                else {
                    let cp;
                    if (ChildProcessInfo.is(result)) {
                        cp = result.process;
                        this._isDetached = result.detached;
                    }
                    else {
                        cp = result;
                        this._isDetached = false;
                    }
                    cp.stderr.on('data', data => this.outputChannel.append(is.string(data) ? data : data.toString(encoding)));
                    return { reader: new node$1.StreamMessageReader(cp.stdout), writer: new node$1.StreamMessageWriter(cp.stdin) };
                }
            });
        }
        let json;
        let runDebug = server;
        if (runDebug.run || runDebug.debug) {
            if (this._forceDebug || startedInDebugMode()) {
                json = runDebug.debug;
            }
            else {
                json = runDebug.run;
            }
        }
        else {
            json = server;
        }
        return this._getServerWorkingDir(json.options).then(serverWorkingDir => {
            if (NodeModule.is(json) && json.module) {
                let node = json;
                let transport = node.transport || TransportKind.stdio;
                if (node.runtime) {
                    let args = [];
                    let options = node.options || Object.create(null);
                    if (options.execArgv) {
                        options.execArgv.forEach(element => args.push(element));
                    }
                    args.push(node.module);
                    if (node.args) {
                        node.args.forEach(element => args.push(element));
                    }
                    const execOptions = Object.create(null);
                    execOptions.cwd = serverWorkingDir;
                    execOptions.env = getEnvironment(options.env, false);
                    const runtime = this._getRuntimePath(node.runtime, serverWorkingDir);
                    let pipeName = undefined;
                    if (transport === TransportKind.ipc) {
                        // exec options not correctly typed in lib
                        execOptions.stdio = [null, null, null, 'ipc'];
                        args.push('--node-ipc');
                    }
                    else if (transport === TransportKind.stdio) {
                        args.push('--stdio');
                    }
                    else if (transport === TransportKind.pipe) {
                        pipeName = node$1.generateRandomPipeName();
                        args.push(`--pipe=${pipeName}`);
                    }
                    else if (Transport.isSocket(transport)) {
                        args.push(`--socket=${transport.port}`);
                    }
                    args.push(`--clientProcessId=${process.pid.toString()}`);
                    if (transport === TransportKind.ipc || transport === TransportKind.stdio) {
                        let serverProcess = cp.spawn(runtime, args, execOptions);
                        if (!serverProcess || !serverProcess.pid) {
                            return Promise.reject(`Launching server using runtime ${runtime} failed.`);
                        }
                        this._serverProcess = serverProcess;
                        serverProcess.stderr.on('data', data => this.outputChannel.append(is.string(data) ? data : data.toString(encoding)));
                        if (transport === TransportKind.ipc) {
                            serverProcess.stdout.on('data', data => this.outputChannel.append(is.string(data) ? data : data.toString(encoding)));
                            return Promise.resolve({ reader: new node$1.IPCMessageReader(serverProcess), writer: new node$1.IPCMessageWriter(serverProcess) });
                        }
                        else {
                            return Promise.resolve({ reader: new node$1.StreamMessageReader(serverProcess.stdout), writer: new node$1.StreamMessageWriter(serverProcess.stdin) });
                        }
                    }
                    else if (transport === TransportKind.pipe) {
                        return node$1.createClientPipeTransport(pipeName).then((transport) => {
                            let process = cp.spawn(runtime, args, execOptions);
                            if (!process || !process.pid) {
                                return Promise.reject(`Launching server using runtime ${runtime} failed.`);
                            }
                            this._serverProcess = process;
                            process.stderr.on('data', data => this.outputChannel.append(is.string(data) ? data : data.toString(encoding)));
                            process.stdout.on('data', data => this.outputChannel.append(is.string(data) ? data : data.toString(encoding)));
                            return transport.onConnected().then((protocol) => {
                                return { reader: protocol[0], writer: protocol[1] };
                            });
                        });
                    }
                    else if (Transport.isSocket(transport)) {
                        return node$1.createClientSocketTransport(transport.port).then((transport) => {
                            let process = cp.spawn(runtime, args, execOptions);
                            if (!process || !process.pid) {
                                return Promise.reject(`Launching server using runtime ${runtime} failed.`);
                            }
                            this._serverProcess = process;
                            process.stderr.on('data', data => this.outputChannel.append(is.string(data) ? data : data.toString(encoding)));
                            process.stdout.on('data', data => this.outputChannel.append(is.string(data) ? data : data.toString(encoding)));
                            return transport.onConnected().then((protocol) => {
                                return { reader: protocol[0], writer: protocol[1] };
                            });
                        });
                    }
                }
                else {
                    let pipeName = undefined;
                    return new Promise((resolve, _reject) => {
                        let args = node.args && node.args.slice() || [];
                        if (transport === TransportKind.ipc) {
                            args.push('--node-ipc');
                        }
                        else if (transport === TransportKind.stdio) {
                            args.push('--stdio');
                        }
                        else if (transport === TransportKind.pipe) {
                            pipeName = node$1.generateRandomPipeName();
                            args.push(`--pipe=${pipeName}`);
                        }
                        else if (Transport.isSocket(transport)) {
                            args.push(`--socket=${transport.port}`);
                        }
                        args.push(`--clientProcessId=${process.pid.toString()}`);
                        let options = node.options || Object.create(null);
                        options.env = getEnvironment(options.env, true);
                        options.execArgv = options.execArgv || [];
                        options.cwd = serverWorkingDir;
                        options.silent = true;
                        if (transport === TransportKind.ipc || transport === TransportKind.stdio) {
                            let sp = cp.fork(node.module, args || [], options);
                            assertStdio(sp);
                            this._serverProcess = sp;
                            sp.stderr.on('data', data => this.outputChannel.append(is.string(data) ? data : data.toString(encoding)));
                            if (transport === TransportKind.ipc) {
                                sp.stdout.on('data', data => this.outputChannel.append(is.string(data) ? data : data.toString(encoding)));
                                resolve({ reader: new node$1.IPCMessageReader(this._serverProcess), writer: new node$1.IPCMessageWriter(this._serverProcess) });
                            }
                            else {
                                resolve({ reader: new node$1.StreamMessageReader(sp.stdout), writer: new node$1.StreamMessageWriter(sp.stdin) });
                            }
                        }
                        else if (transport === TransportKind.pipe) {
                            node$1.createClientPipeTransport(pipeName).then((transport) => {
                                let sp = cp.fork(node.module, args || [], options);
                                assertStdio(sp);
                                this._serverProcess = sp;
                                sp.stderr.on('data', data => this.outputChannel.append(is.string(data) ? data : data.toString(encoding)));
                                sp.stdout.on('data', data => this.outputChannel.append(is.string(data) ? data : data.toString(encoding)));
                                transport.onConnected().then((protocol) => {
                                    resolve({ reader: protocol[0], writer: protocol[1] });
                                });
                            });
                        }
                        else if (Transport.isSocket(transport)) {
                            node$1.createClientSocketTransport(transport.port).then((transport) => {
                                let sp = cp.fork(node.module, args || [], options);
                                assertStdio(sp);
                                this._serverProcess = sp;
                                sp.stderr.on('data', data => this.outputChannel.append(is.string(data) ? data : data.toString(encoding)));
                                sp.stdout.on('data', data => this.outputChannel.append(is.string(data) ? data : data.toString(encoding)));
                                transport.onConnected().then((protocol) => {
                                    resolve({ reader: protocol[0], writer: protocol[1] });
                                });
                            });
                        }
                    });
                }
            }
            else if (Executable.is(json) && json.command) {
                let command = json;
                let args = command.args || [];
                let options = Object.assign({}, command.options);
                options.cwd = options.cwd || serverWorkingDir;
                let serverProcess = cp.spawn(command.command, args, options);
                if (!serverProcess || !serverProcess.pid) {
                    return Promise.reject(`Launching server using command ${command.command} failed.`);
                }
                serverProcess.stderr.on('data', data => this.outputChannel.append(is.string(data) ? data : data.toString(encoding)));
                this._serverProcess = serverProcess;
                this._isDetached = !!options.detached;
                return Promise.resolve({ reader: new node$1.StreamMessageReader(serverProcess.stdout), writer: new node$1.StreamMessageWriter(serverProcess.stdin) });
            }
            return Promise.reject(new Error(`Unsupported server configuration ` + JSON.stringify(server, null, 4)));
        });
    }
    _getRuntimePath(runtime, serverWorkingDirectory) {
        if (path__default['default'].isAbsolute(runtime)) {
            return runtime;
        }
        const mainRootPath = this._mainGetRootPath();
        if (mainRootPath !== undefined) {
            const result = path__default['default'].join(mainRootPath, runtime);
            if (fs__default['default'].existsSync(result)) {
                return result;
            }
        }
        if (serverWorkingDirectory !== undefined) {
            const result = path__default['default'].join(serverWorkingDirectory, runtime);
            if (fs__default['default'].existsSync(result)) {
                return result;
            }
        }
        return runtime;
    }
    _mainGetRootPath() {
        let folders = vscode__default['default'].workspace.workspaceFolders;
        if (!folders || folders.length === 0) {
            return undefined;
        }
        let folder = folders[0];
        if (folder.uri.scheme === 'file') {
            return folder.uri.fsPath;
        }
        return undefined;
    }
    _getServerWorkingDir(options) {
        let cwd = options && options.cwd;
        if (!cwd) {
            cwd = this.clientOptions.workspaceFolder
                ? this.clientOptions.workspaceFolder.uri.fsPath
                : this._mainGetRootPath();
        }
        if (cwd) {
            // make sure the folder exists otherwise creating the process will fail
            return new Promise(s => {
                fs__default['default'].lstat(cwd, (err, stats) => {
                    s(!err && stats.isDirectory() ? cwd : undefined);
                });
            });
        }
        return Promise.resolve(undefined);
    }
    getLocale() {
        const envValue = process.env['VSCODE_NLS_CONFIG'];
        if (envValue === undefined) {
            return 'en';
        }
        let config = undefined;
        try {
            config = JSON.parse(envValue);
        }
        catch (err) {
        }
        if (config === undefined || typeof config.locale !== 'string') {
            return 'en';
        }
        return config.locale;
    }
}
exports.LanguageClient = LanguageClient;
class SettingMonitor {
    constructor(_client, _setting) {
        this._client = _client;
        this._setting = _setting;
        this._listeners = [];
    }
    start() {
        vscode__default['default'].workspace.onDidChangeConfiguration(this.onDidChangeConfiguration, this, this._listeners);
        this.onDidChangeConfiguration();
        return new vscode__default['default'].Disposable(() => {
            if (this._client.needsStop()) {
                this._client.stop();
            }
        });
    }
    onDidChangeConfiguration() {
        let index = this._setting.indexOf('.');
        let primary = index >= 0 ? this._setting.substr(0, index) : this._setting;
        let rest = index >= 0 ? this._setting.substr(index + 1) : undefined;
        let enabled = rest ? vscode__default['default'].workspace.getConfiguration(primary).get(rest, false) : vscode__default['default'].workspace.getConfiguration(primary);
        if (enabled && this._client.needsStart()) {
            this._client.start();
        }
        else if (!enabled && this._client.needsStop()) {
            this._client.stop();
        }
    }
}
exports.SettingMonitor = SettingMonitor;

});

var lsp_ext = createCommonjsModule(function (module, exports) {
/**
 * This file mirrors `crates/rust-analyzer/src/lsp_ext.rs` declarations.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.openCargoToml = exports.openDocs = exports.ssr = exports.inlayHints = exports.runnables = exports.onEnter = exports.joinLines = exports.parentModule = exports.matchingBrace = exports.expandMacro = exports.viewHir = exports.syntaxTree = exports.reloadWorkspace = exports.status = exports.memoryUsage = exports.analyzerStatus = void 0;

exports.analyzerStatus = new main$3.RequestType("rust-analyzer/analyzerStatus");
exports.memoryUsage = new main$3.RequestType0("rust-analyzer/memoryUsage");
exports.status = new main$3.NotificationType("rust-analyzer/status");
exports.reloadWorkspace = new main$3.RequestType0("rust-analyzer/reloadWorkspace");
exports.syntaxTree = new main$3.RequestType("rust-analyzer/syntaxTree");
exports.viewHir = new main$3.RequestType("rust-analyzer/viewHir");
exports.expandMacro = new main$3.RequestType("rust-analyzer/expandMacro");
exports.matchingBrace = new main$3.RequestType("experimental/matchingBrace");
exports.parentModule = new main$3.RequestType("experimental/parentModule");
exports.joinLines = new main$3.RequestType("experimental/joinLines");
exports.onEnter = new main$3.RequestType("experimental/onEnter");
exports.runnables = new main$3.RequestType("experimental/runnables");
exports.inlayHints = new main$3.RequestType("rust-analyzer/inlayHints");
exports.ssr = new main$3.RequestType('experimental/ssr');
exports.openDocs = new main$3.RequestType('experimental/externalDocs');
exports.openCargoToml = new main$3.RequestType("experimental/openCargoToml");

});

/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ----------------------------------------------------------------------------------------- */

var node$2 = main$3;

var util = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.memoize = exports.setContextValue = exports.isValidExecutable = exports.isRustEditor = exports.isRustDocument = exports.sleep = exports.sendRequestWithRetry = exports.log = exports.assert = void 0;





function assert(condition, explanation) {
    try {
        assert_1__default['default'].strict(condition, explanation);
    }
    catch (err) {
        exports.log.error(`Assertion failed:`, explanation);
        throw err;
    }
}
exports.assert = assert;
exports.log = new class {
    constructor() {
        this.enabled = true;
        this.output = vscode__default['default'].window.createOutputChannel("Rust Analyzer Client");
    }
    setEnabled(yes) {
        exports.log.enabled = yes;
    }
    // Hint: the type [T, ...T[]] means a non-empty array
    debug(...msg) {
        if (!exports.log.enabled)
            return;
        exports.log.write("DEBUG", ...msg);
    }
    info(...msg) {
        exports.log.write("INFO", ...msg);
    }
    warn(...msg) {
        debugger;
        exports.log.write("WARN", ...msg);
    }
    error(...msg) {
        debugger;
        exports.log.write("ERROR", ...msg);
        exports.log.output.show(true);
    }
    write(label, ...messageParts) {
        const message = messageParts.map(exports.log.stringify).join(" ");
        const dateTime = new Date().toLocaleString();
        exports.log.output.appendLine(`${label} [${dateTime}]: ${message}`);
    }
    stringify(val) {
        if (typeof val === "string")
            return val;
        return util_1__default['default'].inspect(val, {
            colors: false,
            depth: 6,
        });
    }
};
async function sendRequestWithRetry(client, reqType, param, token) {
    // The sequence is `10 * (2 ** (2 * n))` where n is 1, 2, 3...
    for (const delay of [40, 160, 640, 2560, 10240, null]) {
        try {
            return await (token
                ? client.sendRequest(reqType, param, token)
                : client.sendRequest(reqType, param));
        }
        catch (error) {
            if (delay === null) {
                exports.log.warn("LSP request timed out", { method: reqType.method, param, error });
                throw error;
            }
            if (error.code === node$2.LSPErrorCodes.RequestCancelled) {
                throw error;
            }
            if (error.code !== node$2.LSPErrorCodes.ContentModified) {
                exports.log.warn("LSP request failed", { method: reqType.method, param, error });
                throw error;
            }
            await sleep(delay);
        }
    }
    throw 'unreachable';
}
exports.sendRequestWithRetry = sendRequestWithRetry;
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
exports.sleep = sleep;
function isRustDocument(document) {
    // Prevent corrupted text (particularly via inlay hints) in diff views
    // by allowing only `file` schemes
    // unfortunately extensions that use diff views not always set this
    // to something different than 'file' (see ongoing bug: #4608)
    return document.languageId === 'rust' && document.uri.scheme === 'file';
}
exports.isRustDocument = isRustDocument;
function isRustEditor(editor) {
    return isRustDocument(editor.document);
}
exports.isRustEditor = isRustEditor;
function isValidExecutable(path) {
    exports.log.debug("Checking availability of a binary at", path);
    const res = cp__default['default'].spawnSync(path, ["--version"], { encoding: 'utf8' });
    const printOutput = res.error && res.error.code !== 'ENOENT' ? exports.log.warn : exports.log.debug;
    printOutput(path, "--version:", res);
    return res.status === 0;
}
exports.isValidExecutable = isValidExecutable;
/** Sets ['when'](https://code.visualstudio.com/docs/getstarted/keybindings#_when-clause-contexts) clause contexts */
function setContextValue(key, value) {
    return vscode__default['default'].commands.executeCommand('setContext', key, value);
}
exports.setContextValue = setContextValue;
/**
 * Returns a higher-order function that caches the results of invoking the
 * underlying function.
 */
function memoize(func) {
    const cache = new Map();
    return function (arg) {
        const cached = cache.get(arg);
        if (cached)
            return cached;
        const result = func.call(this, arg);
        cache.set(arg, result);
        return result;
    };
}
exports.memoize = memoize;

});

var snippets = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.applySnippetTextEdits = exports.applySnippetWorkspaceEdit = void 0;


async function applySnippetWorkspaceEdit(edit) {
    if (edit.entries().length === 1) {
        const [uri, edits] = edit.entries()[0];
        const editor = await editorFromUri(uri);
        if (editor)
            await applySnippetTextEdits(editor, edits);
        return;
    }
    for (const [uri, edits] of edit.entries()) {
        const editor = await editorFromUri(uri);
        if (editor)
            await editor.edit((builder) => {
                for (const indel of edits) {
                    util.assert(!parseSnippet(indel.newText), `bad ws edit: snippet received with multiple edits: ${JSON.stringify(edit)}`);
                    builder.replace(indel.range, indel.newText);
                }
            });
    }
}
exports.applySnippetWorkspaceEdit = applySnippetWorkspaceEdit;
async function editorFromUri(uri) {
    var _a;
    if (((_a = vscode__default['default'].window.activeTextEditor) === null || _a === void 0 ? void 0 : _a.document.uri) !== uri) {
        // `vscode.window.visibleTextEditors` only contains editors whose contents are being displayed
        await vscode__default['default'].window.showTextDocument(uri, {});
    }
    return vscode__default['default'].window.visibleTextEditors.find((it) => it.document.uri.toString() === uri.toString());
}
async function applySnippetTextEdits(editor, edits) {
    let selection = undefined;
    let lineDelta = 0;
    await editor.edit((builder) => {
        for (const indel of edits) {
            const parsed = parseSnippet(indel.newText);
            if (parsed) {
                const [newText, [placeholderStart, placeholderLength]] = parsed;
                const prefix = newText.substr(0, placeholderStart);
                const lastNewline = prefix.lastIndexOf('\n');
                const startLine = indel.range.start.line + lineDelta + countLines(prefix);
                const startColumn = lastNewline === -1 ?
                    indel.range.start.character + placeholderStart
                    : prefix.length - lastNewline - 1;
                const endColumn = startColumn + placeholderLength;
                selection = new vscode__default['default'].Selection(new vscode__default['default'].Position(startLine, startColumn), new vscode__default['default'].Position(startLine, endColumn));
                builder.replace(indel.range, newText);
            }
            else {
                lineDelta = countLines(indel.newText) - (indel.range.end.line - indel.range.start.line);
                builder.replace(indel.range, indel.newText);
            }
        }
    });
    if (selection)
        editor.selection = selection;
}
exports.applySnippetTextEdits = applySnippetTextEdits;
function parseSnippet(snip) {
    var _a;
    const m = snip.match(/\$(0|\{0:([^}]*)\})/);
    if (!m)
        return undefined;
    const placeholder = (_a = m[2]) !== null && _a !== void 0 ? _a : "";
    const range = [m.index, placeholder.length];
    const insert = snip.replace(m[0], placeholder);
    return [insert, range];
}
function countLines(text) {
    return (text.match(/\n/g) || []).length;
}

});

var toolchain = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPathForExecutable = exports.cargoPath = exports.Cargo = void 0;






class Cargo {
    constructor(rootFolder, output) {
        this.rootFolder = rootFolder;
        this.output = output;
    }
    // Made public for testing purposes
    static artifactSpec(args) {
        const cargoArgs = [...args, "--message-format=json"];
        // arguments for a runnable from the quick pick should be updated.
        // see crates\rust-analyzer\src\main_loop\handlers.rs, handle_code_lens
        switch (cargoArgs[0]) {
            case "run":
                cargoArgs[0] = "build";
                break;
            case "test": {
                if (!cargoArgs.includes("--no-run")) {
                    cargoArgs.push("--no-run");
                }
                break;
            }
        }
        const result = { cargoArgs: cargoArgs };
        if (cargoArgs[0] === "test") {
            // for instance, `crates\rust-analyzer\tests\heavy_tests\main.rs` tests
            // produce 2 artifacts: {"kind": "bin"} and {"kind": "test"}
            result.filter = (artifacts) => artifacts.filter(it => it.isTest);
        }
        return result;
    }
    async getArtifacts(spec) {
        var _a, _b;
        const artifacts = [];
        try {
            await this.runCargo(spec.cargoArgs, message => {
                if (message.reason === 'compiler-artifact' && message.executable) {
                    const isBinary = message.target.crate_types.includes('bin');
                    const isBuildScript = message.target.kind.includes('custom-build');
                    if ((isBinary && !isBuildScript) || message.profile.test) {
                        artifacts.push({
                            fileName: message.executable,
                            name: message.target.name,
                            kind: message.target.kind[0],
                            isTest: message.profile.test
                        });
                    }
                }
                else if (message.reason === 'compiler-message') {
                    this.output.append(message.message.rendered);
                }
            }, stderr => this.output.append(stderr));
        }
        catch (err) {
            this.output.show(true);
            throw new Error(`Cargo invocation has failed: ${err}`);
        }
        return (_b = (_a = spec.filter) === null || _a === void 0 ? void 0 : _a.call(spec, artifacts)) !== null && _b !== void 0 ? _b : artifacts;
    }
    async executableFromArgs(args) {
        const artifacts = await this.getArtifacts(Cargo.artifactSpec(args));
        if (artifacts.length === 0) {
            throw new Error('No compilation artifacts');
        }
        else if (artifacts.length > 1) {
            throw new Error('Multiple compilation artifacts are not supported.');
        }
        return artifacts[0].fileName;
    }
    runCargo(cargoArgs, onStdoutJson, onStderrString) {
        return new Promise((resolve, reject) => {
            const cargo = cp__default['default'].spawn(cargoPath(), cargoArgs, {
                stdio: ['ignore', 'pipe', 'pipe'],
                cwd: this.rootFolder
            });
            cargo.on('error', err => reject(new Error(`could not launch cargo: ${err}`)));
            cargo.stderr.on('data', chunk => onStderrString(chunk.toString()));
            const rl = readline__default['default'].createInterface({ input: cargo.stdout });
            rl.on('line', line => {
                const message = JSON.parse(line);
                onStdoutJson(message);
            });
            cargo.on('exit', (exitCode, _) => {
                if (exitCode === 0)
                    resolve(exitCode);
                else
                    reject(new Error(`exit code: ${exitCode}.`));
            });
        });
    }
}
exports.Cargo = Cargo;
/** Mirrors `toolchain::cargo()` implementation */
function cargoPath() {
    return exports.getPathForExecutable("cargo");
}
exports.cargoPath = cargoPath;
/** Mirrors `toolchain::get_path_for_executable()` implementation */
exports.getPathForExecutable = util.memoize(
// We apply caching to decrease file-system interactions
(executableName) => {
    {
        const envVar = process.env[executableName.toUpperCase()];
        if (envVar)
            return envVar;
    }
    if (lookupInPath(executableName))
        return executableName;
    try {
        // hmm, `os.homedir()` seems to be infallible
        // it is not mentioned in docs and cannot be infered by the type signature...
        const standardPath = path__default['default'].join(os__default['default'].homedir(), ".cargo", "bin", executableName);
        if (isFile(standardPath))
            return standardPath;
    }
    catch (err) {
        util.log.error("Failed to read the fs info", err);
    }
    return executableName;
});
function lookupInPath(exec) {
    var _a;
    const paths = (_a = process.env.PATH) !== null && _a !== void 0 ? _a : "";
    const candidates = paths.split(path__default['default'].delimiter).flatMap(dirInPath => {
        const candidate = path__default['default'].join(dirInPath, exec);
        return os__default['default'].type() === "Windows_NT"
            ? [candidate, `${candidate}.exe`]
            : [candidate];
    });
    return candidates.some(isFile);
}
function isFile(suspectPath) {
    // It is not mentionned in docs, but `statSync()` throws an error when
    // the path doesn't exist
    try {
        return fs__default['default'].statSync(suspectPath).isFile();
    }
    catch {
        return false;
    }
}

});

var tasks = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.activateTaskProvider = exports.buildCargoTask = exports.TASK_SOURCE = exports.TASK_TYPE = void 0;



// This ends up as the `type` key in tasks.json. RLS also uses `cargo` and
// our configuration should be compatible with it so use the same key.
exports.TASK_TYPE = 'cargo';
exports.TASK_SOURCE = 'rust';
class CargoTaskProvider {
    constructor(target, config) {
        this.target = target;
        this.config = config;
    }
    async provideTasks() {
        // Detect Rust tasks. Currently we do not do any actual detection
        // of tasks (e.g. aliases in .cargo/config) and just return a fixed
        // set of tasks that always exist. These tasks cannot be removed in
        // tasks.json - only tweaked.
        const defs = [
            { command: 'build', group: vscode__default['default'].TaskGroup.Build },
            { command: 'check', group: vscode__default['default'].TaskGroup.Build },
            { command: 'test', group: vscode__default['default'].TaskGroup.Test },
            { command: 'clean', group: vscode__default['default'].TaskGroup.Clean },
            { command: 'run', group: undefined },
        ];
        const tasks = [];
        for (const def of defs) {
            const vscodeTask = await buildCargoTask(this.target, { type: exports.TASK_TYPE, command: def.command }, `cargo ${def.command}`, [def.command], this.config.cargoRunner);
            vscodeTask.group = def.group;
            tasks.push(vscodeTask);
        }
        return tasks;
    }
    async resolveTask(task) {
        // VSCode calls this for every cargo task in the user's tasks.json,
        // we need to inform VSCode how to execute that command by creating
        // a ShellExecution for it.
        var _a;
        const definition = task.definition;
        if (definition.type === exports.TASK_TYPE && definition.command) {
            const args = [definition.command].concat((_a = definition.args) !== null && _a !== void 0 ? _a : []);
            return await buildCargoTask(this.target, definition, task.name, args, this.config.cargoRunner);
        }
        return undefined;
    }
}
async function buildCargoTask(target, definition, name, args, customRunner, throwOnError = false) {
    let exec = undefined;
    if (customRunner) {
        const runnerCommand = `${customRunner}.buildShellExecution`;
        try {
            const runnerArgs = { kind: exports.TASK_TYPE, args, cwd: definition.cwd, env: definition.env };
            const customExec = await vscode__default['default'].commands.executeCommand(runnerCommand, runnerArgs);
            if (customExec) {
                if (customExec instanceof vscode__default['default'].ShellExecution) {
                    exec = customExec;
                }
                else {
                    util.log.debug("Invalid cargo ShellExecution", customExec);
                    throw "Invalid cargo ShellExecution.";
                }
            }
            // fallback to default processing
        }
        catch (e) {
            if (throwOnError)
                throw `Cargo runner '${customRunner}' failed! ${e}`;
            // fallback to default processing
        }
    }
    if (!exec) {
        // Check whether we must use a user-defined substitute for cargo.
        const cargoCommand = definition.overrideCargo ? definition.overrideCargo : toolchain.cargoPath();
        // Prepare the whole command as one line. It is required if user has provided override command which contains spaces,
        // for example "wrapper cargo". Without manual preparation the overridden command will be quoted and fail to execute.
        const fullCommand = [cargoCommand, ...args].join(" ");
        exec = new vscode__default['default'].ShellExecution(fullCommand, definition);
    }
    return new vscode__default['default'].Task(definition, target, name, exports.TASK_SOURCE, exec, ['$rustc']);
}
exports.buildCargoTask = buildCargoTask;
function activateTaskProvider(target, config) {
    const provider = new CargoTaskProvider(target, config);
    return vscode__default['default'].tasks.registerTaskProvider(exports.TASK_TYPE, provider);
}
exports.activateTaskProvider = activateTaskProvider;

});

var debug$1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.startDebugSession = exports.makeDebugConfig = void 0;





const debugOutput = vscode__default['default'].window.createOutputChannel("Debug");
async function makeDebugConfig(ctx, runnable) {
    var _a;
    const scope = (_a = ctx.activeRustEditor) === null || _a === void 0 ? void 0 : _a.document.uri;
    if (!scope)
        return;
    const debugConfig = await getDebugConfiguration(ctx, runnable);
    if (!debugConfig)
        return;
    const wsLaunchSection = vscode__default['default'].workspace.getConfiguration("launch", scope);
    const configurations = wsLaunchSection.get("configurations") || [];
    const index = configurations.findIndex(c => c.name === debugConfig.name);
    if (index !== -1) {
        const answer = await vscode__default['default'].window.showErrorMessage(`Launch configuration '${debugConfig.name}' already exists!`, 'Cancel', 'Update');
        if (answer === "Cancel")
            return;
        configurations[index] = debugConfig;
    }
    else {
        configurations.push(debugConfig);
    }
    await wsLaunchSection.update("configurations", configurations);
}
exports.makeDebugConfig = makeDebugConfig;
async function startDebugSession(ctx, runnable) {
    let debugConfig = undefined;
    let message = "";
    const wsLaunchSection = vscode__default['default'].workspace.getConfiguration("launch");
    const configurations = wsLaunchSection.get("configurations") || [];
    const index = configurations.findIndex(c => c.name === runnable.label);
    if (-1 !== index) {
        debugConfig = configurations[index];
        message = " (from launch.json)";
        debugOutput.clear();
    }
    else {
        debugConfig = await getDebugConfiguration(ctx, runnable);
    }
    if (!debugConfig)
        return false;
    debugOutput.appendLine(`Launching debug configuration${message}:`);
    debugOutput.appendLine(JSON.stringify(debugConfig, null, 2));
    return vscode__default['default'].debug.startDebugging(undefined, debugConfig);
}
exports.startDebugSession = startDebugSession;
async function getDebugConfiguration(ctx, runnable) {
    const editor = ctx.activeRustEditor;
    if (!editor)
        return;
    const knownEngines = {
        "vadimcn.vscode-lldb": getLldbDebugConfig,
        "ms-vscode.cpptools": getCppvsDebugConfig
    };
    const debugOptions = ctx.config.debug;
    let debugEngine = null;
    if (debugOptions.engine === "auto") {
        for (var engineId in knownEngines) {
            debugEngine = vscode__default['default'].extensions.getExtension(engineId);
            if (debugEngine)
                break;
        }
    }
    else {
        debugEngine = vscode__default['default'].extensions.getExtension(debugOptions.engine);
    }
    if (!debugEngine) {
        vscode__default['default'].window.showErrorMessage(`Install [CodeLLDB](https://marketplace.visualstudio.com/items?itemName=vadimcn.vscode-lldb)`
            + ` or [MS C++ tools](https://marketplace.visualstudio.com/items?itemName=ms-vscode.cpptools) extension for debugging.`);
        return;
    }
    debugOutput.clear();
    if (ctx.config.debug.openDebugPane) {
        debugOutput.show(true);
    }
    const isMultiFolderWorkspace = vscode__default['default'].workspace.workspaceFolders.length > 1;
    const firstWorkspace = vscode__default['default'].workspace.workspaceFolders[0]; // folder exists or RA is not active.
    const workspace = !isMultiFolderWorkspace || !runnable.args.workspaceRoot ?
        firstWorkspace :
        vscode__default['default'].workspace.workspaceFolders.find(w => { var _a; return (_a = runnable.args.workspaceRoot) === null || _a === void 0 ? void 0 : _a.includes(w.uri.fsPath); }) || firstWorkspace;
    const wsFolder = path__default['default'].normalize(workspace.uri.fsPath);
    const workspaceQualifier = isMultiFolderWorkspace ? `:${workspace.name}` : '';
    function simplifyPath(p) {
        // see https://github.com/rust-analyzer/rust-analyzer/pull/5513#issuecomment-663458818 for why this is needed
        return path__default['default'].normalize(p).replace(wsFolder, '${workspaceFolder' + workspaceQualifier + '}');
    }
    const executable = await getDebugExecutable(runnable);
    const env = run.prepareEnv(runnable, ctx.config.runnableEnv);
    const debugConfig = knownEngines[debugEngine.id](runnable, simplifyPath(executable), env, debugOptions.sourceFileMap);
    if (debugConfig.type in debugOptions.engineSettings) {
        const settingsMap = debugOptions.engineSettings[debugConfig.type];
        for (var key in settingsMap) {
            debugConfig[key] = settingsMap[key];
        }
    }
    if (debugConfig.name === "run binary") {
        // The LSP side: crates\rust-analyzer\src\main_loop\handlers.rs,
        // fn to_lsp_runnable(...) with RunnableKind::Bin
        debugConfig.name = `run ${path__default['default'].basename(executable)}`;
    }
    if (debugConfig.cwd) {
        debugConfig.cwd = simplifyPath(debugConfig.cwd);
    }
    return debugConfig;
}
async function getDebugExecutable(runnable) {
    const cargo = new toolchain.Cargo(runnable.args.workspaceRoot || '.', debugOutput);
    const executable = await cargo.executableFromArgs(runnable.args.cargoArgs);
    // if we are here, there were no compilation errors.
    return executable;
}
function getLldbDebugConfig(runnable, executable, env, sourceFileMap) {
    return {
        type: "lldb",
        request: "launch",
        name: runnable.label,
        program: executable,
        args: runnable.args.executableArgs,
        cwd: runnable.args.workspaceRoot,
        sourceMap: sourceFileMap,
        sourceLanguages: ["rust"],
        env
    };
}
function getCppvsDebugConfig(runnable, executable, env, sourceFileMap) {
    return {
        type: (os__default['default'].platform() === "win32") ? "cppvsdbg" : "cppdbg",
        request: "launch",
        name: runnable.label,
        program: executable,
        args: runnable.args.executableArgs,
        cwd: runnable.args.workspaceRoot,
        sourceFileMap,
        env,
    };
}

});

var run = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTask = exports.prepareEnv = exports.RunnableQuickPick = exports.selectRunnable = void 0;




const quickPickButtons = [{ iconPath: new vscode__default['default'].ThemeIcon("save"), tooltip: "Save as a launch.json configurtation." }];
async function selectRunnable(ctx, prevRunnable, debuggeeOnly = false, showButtons = true) {
    const editor = ctx.activeRustEditor;
    const client = ctx.client;
    if (!editor || !client)
        return;
    const textDocument = {
        uri: editor.document.uri.toString(),
    };
    const runnables = await client.sendRequest(lsp_ext.runnables, {
        textDocument,
        position: client.code2ProtocolConverter.asPosition(editor.selection.active),
    });
    const items = [];
    if (prevRunnable) {
        items.push(prevRunnable);
    }
    for (const r of runnables) {
        if (prevRunnable &&
            JSON.stringify(prevRunnable.runnable) === JSON.stringify(r)) {
            continue;
        }
        if (debuggeeOnly && (r.label.startsWith('doctest') || r.label.startsWith('cargo'))) {
            continue;
        }
        items.push(new RunnableQuickPick(r));
    }
    if (items.length === 0) {
        // it is the debug case, run always has at least 'cargo check ...'
        // see crates\rust-analyzer\src\main_loop\handlers.rs, handle_runnables
        vscode__default['default'].window.showErrorMessage("There's no debug target!");
        return;
    }
    return await new Promise((resolve) => {
        const disposables = [];
        const close = (result) => {
            resolve(result);
            disposables.forEach(d => d.dispose());
        };
        const quickPick = vscode__default['default'].window.createQuickPick();
        quickPick.items = items;
        quickPick.title = "Select Runnable";
        if (showButtons) {
            quickPick.buttons = quickPickButtons;
        }
        disposables.push(quickPick.onDidHide(() => close()), quickPick.onDidAccept(() => close(quickPick.selectedItems[0])), quickPick.onDidTriggerButton((_button) => {
            (async () => await debug$1.makeDebugConfig(ctx, quickPick.activeItems[0].runnable))();
            close();
        }), quickPick.onDidChangeActive((active) => {
            if (showButtons && active.length > 0) {
                if (active[0].label.startsWith('cargo')) {
                    // save button makes no sense for `cargo test` or `cargo check`
                    quickPick.buttons = [];
                }
                else if (quickPick.buttons.length === 0) {
                    quickPick.buttons = quickPickButtons;
                }
            }
        }), quickPick);
        quickPick.show();
    });
}
exports.selectRunnable = selectRunnable;
class RunnableQuickPick {
    constructor(runnable) {
        this.runnable = runnable;
        this.label = runnable.label;
    }
}
exports.RunnableQuickPick = RunnableQuickPick;
function prepareEnv(runnable, runnableEnvCfg) {
    const env = { "RUST_BACKTRACE": "short" };
    if (runnable.args.expectTest) {
        env["UPDATE_EXPECT"] = "1";
    }
    Object.assign(env, process.env);
    if (runnableEnvCfg) {
        if (Array.isArray(runnableEnvCfg)) {
            for (const it of runnableEnvCfg) {
                if (!it.mask || new RegExp(it.mask).test(runnable.label)) {
                    Object.assign(env, it.env);
                }
            }
        }
        else {
            Object.assign(env, runnableEnvCfg);
        }
    }
    return env;
}
exports.prepareEnv = prepareEnv;
async function createTask(runnable, config) {
    if (runnable.kind !== "cargo") {
        // rust-analyzer supports only one kind, "cargo"
        // do not use tasks.TASK_TYPE here, these are completely different meanings.
        throw `Unexpected runnable kind: ${runnable.kind}`;
    }
    const args = [...runnable.args.cargoArgs]; // should be a copy!
    if (runnable.args.cargoExtraArgs) {
        args.push(...runnable.args.cargoExtraArgs); // Append user-specified cargo options.
    }
    if (runnable.args.executableArgs.length > 0) {
        args.push('--', ...runnable.args.executableArgs);
    }
    const definition = {
        type: tasks.TASK_TYPE,
        command: args[0],
        args: args.slice(1),
        cwd: runnable.args.workspaceRoot || ".",
        env: prepareEnv(runnable, config.runnableEnv),
        overrideCargo: runnable.args.overrideCargo,
    };
    const target = vscode__default['default'].workspace.workspaceFolders[0]; // safe, see main activate()
    const cargoTask = await tasks.buildCargoTask(target, definition, runnable.label, args, config.cargoRunner, true);
    cargoTask.presentationOptions.clear = true;
    return cargoTask;
}
exports.createTask = createTask;

});

var ast_inspector = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.AstInspector = void 0;


// FIXME: consider implementing this via the Tree View API?
// https://code.visualstudio.com/api/extension-guides/tree-view
class AstInspector {
    constructor(ctx) {
        this.astDecorationType = vscode__default['default'].window.createTextEditorDecorationType({
            borderColor: new vscode__default['default'].ThemeColor('rust_analyzer.syntaxTreeBorder'),
            borderStyle: "solid",
            borderWidth: "2px",
        });
        // Lazy rust token range -> syntax tree file range.
        this.rust2Ast = new Lazy(() => {
            const astEditor = this.findAstTextEditor();
            if (!this.rustEditor || !astEditor)
                return undefined;
            const buf = [];
            for (let i = 0; i < astEditor.document.lineCount; ++i) {
                const astLine = astEditor.document.lineAt(i);
                // Heuristically look for nodes with quoted text (which are token nodes)
                const isTokenNode = astLine.text.lastIndexOf('"') >= 0;
                if (!isTokenNode)
                    continue;
                const rustRange = this.parseRustTextRange(this.rustEditor.document, astLine.text);
                if (!rustRange)
                    continue;
                buf.push([rustRange, this.findAstNodeRange(astLine)]);
            }
            return buf;
        });
        ctx.pushCleanup(vscode__default['default'].languages.registerHoverProvider({ scheme: 'rust-analyzer' }, this));
        ctx.pushCleanup(vscode__default['default'].languages.registerDefinitionProvider({ language: "rust" }, this));
        vscode__default['default'].workspace.onDidCloseTextDocument(this.onDidCloseTextDocument, this, ctx.subscriptions);
        vscode__default['default'].workspace.onDidChangeTextDocument(this.onDidChangeTextDocument, this, ctx.subscriptions);
        vscode__default['default'].window.onDidChangeVisibleTextEditors(this.onDidChangeVisibleTextEditors, this, ctx.subscriptions);
        ctx.pushCleanup(this);
    }
    dispose() {
        this.setRustEditor(undefined);
    }
    onDidChangeTextDocument(event) {
        if (this.rustEditor && event.document.uri.toString() === this.rustEditor.document.uri.toString()) {
            this.rust2Ast.reset();
        }
    }
    onDidCloseTextDocument(doc) {
        if (this.rustEditor && doc.uri.toString() === this.rustEditor.document.uri.toString()) {
            this.setRustEditor(undefined);
        }
    }
    onDidChangeVisibleTextEditors(editors) {
        if (!this.findAstTextEditor()) {
            this.setRustEditor(undefined);
            return;
        }
        this.setRustEditor(editors.find(util.isRustEditor));
    }
    findAstTextEditor() {
        return vscode__default['default'].window.visibleTextEditors.find(it => it.document.uri.scheme === 'rust-analyzer');
    }
    setRustEditor(newRustEditor) {
        if (this.rustEditor && this.rustEditor !== newRustEditor) {
            this.rustEditor.setDecorations(this.astDecorationType, []);
            this.rust2Ast.reset();
        }
        this.rustEditor = newRustEditor;
    }
    // additional positional params are omitted
    provideDefinition(doc, pos) {
        var _a;
        if (!this.rustEditor || doc.uri.toString() !== this.rustEditor.document.uri.toString())
            return;
        const astEditor = this.findAstTextEditor();
        if (!astEditor)
            return;
        const rust2AstRanges = (_a = this.rust2Ast.get()) === null || _a === void 0 ? void 0 : _a.find(([rustRange, _]) => rustRange.contains(pos));
        if (!rust2AstRanges)
            return;
        const [rustFileRange, astFileRange] = rust2AstRanges;
        astEditor.revealRange(astFileRange);
        astEditor.selection = new vscode__default['default'].Selection(astFileRange.start, astFileRange.end);
        return [{
                targetRange: astFileRange,
                targetUri: astEditor.document.uri,
                originSelectionRange: rustFileRange,
                targetSelectionRange: astFileRange,
            }];
    }
    // additional positional params are omitted
    provideHover(doc, hoverPosition) {
        if (!this.rustEditor)
            return;
        const astFileLine = doc.lineAt(hoverPosition.line);
        const rustFileRange = this.parseRustTextRange(this.rustEditor.document, astFileLine.text);
        if (!rustFileRange)
            return;
        this.rustEditor.setDecorations(this.astDecorationType, [rustFileRange]);
        this.rustEditor.revealRange(rustFileRange);
        const rustSourceCode = this.rustEditor.document.getText(rustFileRange);
        const astFileRange = this.findAstNodeRange(astFileLine);
        return new vscode__default['default'].Hover(["```rust\n" + rustSourceCode + "\n```"], astFileRange);
    }
    findAstNodeRange(astLine) {
        const lineOffset = astLine.range.start;
        const begin = lineOffset.translate(undefined, astLine.firstNonWhitespaceCharacterIndex);
        const end = lineOffset.translate(undefined, astLine.text.trimEnd().length);
        return new vscode__default['default'].Range(begin, end);
    }
    parseRustTextRange(doc, astLine) {
        const parsedRange = /(\d+)\.\.(\d+)/.exec(astLine);
        if (!parsedRange)
            return;
        const [begin, end] = parsedRange
            .slice(1)
            .map(off => this.positionAt(doc, +off));
        return new vscode__default['default'].Range(begin, end);
    }
    positionAt(doc, targetOffset) {
        if (doc.eol === vscode__default['default'].EndOfLine.LF) {
            return doc.positionAt(targetOffset);
        }
        // Dirty workaround for crlf line endings
        // We are still in this prehistoric era of carriage returns here...
        let line = 0;
        let offset = 0;
        const cache = this.cache;
        if ((cache === null || cache === void 0 ? void 0 : cache.doc) === doc && cache.offset <= targetOffset) {
            ({ line, offset } = cache);
        }
        while (true) {
            const lineLenWithLf = doc.lineAt(line).text.length + 1;
            if (offset + lineLenWithLf > targetOffset) {
                this.cache = { doc, offset, line };
                return doc.positionAt(targetOffset + line);
            }
            offset += lineLenWithLf;
            line += 1;
        }
    }
}
exports.AstInspector = AstInspector;
class Lazy {
    constructor(compute) {
        this.compute = compute;
    }
    get() {
        var _a;
        return (_a = this.val) !== null && _a !== void 0 ? _a : (this.val = this.compute());
    }
    reset() {
        this.val = undefined;
    }
}

});

var commands = createCommonjsModule(function (module, exports) {
var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (commonjsGlobal && commonjsGlobal.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.newDebugConfig = exports.debugSingle = exports.debug = exports.runSingle = exports.run = exports.applySnippetWorkspaceEditCommand = exports.resolveCodeAction = exports.openDocs = exports.gotoLocation = exports.applyActionGroup = exports.showReferences = exports.reloadWorkspace = exports.expandMacro = exports.viewHir = exports.syntaxTree = exports.toggleInlayHints = exports.serverVersion = exports.ssr = exports.openCargoToml = exports.parentModule = exports.onEnter = exports.joinLines = exports.matchingBrace = exports.memoryUsage = exports.analyzerStatus = void 0;









__exportStar(ast_inspector, exports);
__exportStar(run, exports);
function analyzerStatus(ctx) {
    const tdcp = new class {
        constructor() {
            this.uri = vscode__default['default'].Uri.parse('rust-analyzer-status://status');
            this.eventEmitter = new vscode__default['default'].EventEmitter();
        }
        provideTextDocumentContent(_uri) {
            var _a;
            if (!vscode__default['default'].window.activeTextEditor)
                return '';
            const params = {};
            const doc = (_a = ctx.activeRustEditor) === null || _a === void 0 ? void 0 : _a.document;
            if (doc != null) {
                params.textDocument = ctx.client.code2ProtocolConverter.asTextDocumentIdentifier(doc);
            }
            return ctx.client.sendRequest(lsp_ext.analyzerStatus, params);
        }
        get onDidChange() {
            return this.eventEmitter.event;
        }
    }();
    let poller = undefined;
    ctx.pushCleanup(vscode__default['default'].workspace.registerTextDocumentContentProvider('rust-analyzer-status', tdcp));
    ctx.pushCleanup({
        dispose() {
            if (poller !== undefined) {
                clearInterval(poller);
            }
        },
    });
    return async () => {
        if (poller === undefined) {
            poller = setInterval(() => tdcp.eventEmitter.fire(tdcp.uri), 1000);
        }
        const document = await vscode__default['default'].workspace.openTextDocument(tdcp.uri);
        return vscode__default['default'].window.showTextDocument(document, vscode__default['default'].ViewColumn.Two, true);
    };
}
exports.analyzerStatus = analyzerStatus;
function memoryUsage(ctx) {
    const tdcp = new class {
        constructor() {
            this.uri = vscode__default['default'].Uri.parse('rust-analyzer-memory://memory');
            this.eventEmitter = new vscode__default['default'].EventEmitter();
        }
        provideTextDocumentContent(_uri) {
            if (!vscode__default['default'].window.activeTextEditor)
                return '';
            return ctx.client.sendRequest(lsp_ext.memoryUsage).then((mem) => {
                return 'Per-query memory usage:\n' + mem + '\n(note: database has been cleared)';
            });
        }
        get onDidChange() {
            return this.eventEmitter.event;
        }
    }();
    ctx.pushCleanup(vscode__default['default'].workspace.registerTextDocumentContentProvider('rust-analyzer-memory', tdcp));
    return async () => {
        tdcp.eventEmitter.fire(tdcp.uri);
        const document = await vscode__default['default'].workspace.openTextDocument(tdcp.uri);
        return vscode__default['default'].window.showTextDocument(document, vscode__default['default'].ViewColumn.Two, true);
    };
}
exports.memoryUsage = memoryUsage;
function matchingBrace(ctx) {
    return async () => {
        const editor = ctx.activeRustEditor;
        const client = ctx.client;
        if (!editor || !client)
            return;
        const response = await client.sendRequest(lsp_ext.matchingBrace, {
            textDocument: ctx.client.code2ProtocolConverter.asTextDocumentIdentifier(editor.document),
            positions: editor.selections.map(s => client.code2ProtocolConverter.asPosition(s.active)),
        });
        editor.selections = editor.selections.map((sel, idx) => {
            const active = client.protocol2CodeConverter.asPosition(response[idx]);
            const anchor = sel.isEmpty ? active : sel.anchor;
            return new vscode__default['default'].Selection(anchor, active);
        });
        editor.revealRange(editor.selection);
    };
}
exports.matchingBrace = matchingBrace;
function joinLines(ctx) {
    return async () => {
        const editor = ctx.activeRustEditor;
        const client = ctx.client;
        if (!editor || !client)
            return;
        const items = await client.sendRequest(lsp_ext.joinLines, {
            ranges: editor.selections.map((it) => client.code2ProtocolConverter.asRange(it)),
            textDocument: ctx.client.code2ProtocolConverter.asTextDocumentIdentifier(editor.document),
        });
        editor.edit((builder) => {
            client.protocol2CodeConverter.asTextEdits(items).forEach((edit) => {
                builder.replace(edit.range, edit.newText);
            });
        });
    };
}
exports.joinLines = joinLines;
function onEnter(ctx) {
    async function handleKeypress() {
        const editor = ctx.activeRustEditor;
        const client = ctx.client;
        if (!editor || !client)
            return false;
        const lcEdits = await client.sendRequest(lsp_ext.onEnter, {
            textDocument: ctx.client.code2ProtocolConverter.asTextDocumentIdentifier(editor.document),
            position: client.code2ProtocolConverter.asPosition(editor.selection.active),
        }).catch((_error) => {
            // client.handleFailedRequest(OnEnterRequest.type, error, null);
            return null;
        });
        if (!lcEdits)
            return false;
        const edits = client.protocol2CodeConverter.asTextEdits(lcEdits);
        await snippets.applySnippetTextEdits(editor, edits);
        return true;
    }
    return async () => {
        if (await handleKeypress())
            return;
        await vscode__default['default'].commands.executeCommand('default:type', { text: '\n' });
    };
}
exports.onEnter = onEnter;
function parentModule(ctx) {
    return async () => {
        const editor = ctx.activeRustEditor;
        const client = ctx.client;
        if (!editor || !client)
            return;
        const response = await client.sendRequest(lsp_ext.parentModule, {
            textDocument: ctx.client.code2ProtocolConverter.asTextDocumentIdentifier(editor.document),
            position: client.code2ProtocolConverter.asPosition(editor.selection.active),
        });
        const loc = response[0];
        if (!loc)
            return;
        const uri = client.protocol2CodeConverter.asUri(loc.targetUri);
        const range = client.protocol2CodeConverter.asRange(loc.targetRange);
        const doc = await vscode__default['default'].workspace.openTextDocument(uri);
        const e = await vscode__default['default'].window.showTextDocument(doc);
        e.selection = new vscode__default['default'].Selection(range.start, range.start);
        e.revealRange(range, vscode__default['default'].TextEditorRevealType.InCenter);
    };
}
exports.parentModule = parentModule;
function openCargoToml(ctx) {
    return async () => {
        const editor = ctx.activeRustEditor;
        const client = ctx.client;
        if (!editor || !client)
            return;
        const response = await client.sendRequest(lsp_ext.openCargoToml, {
            textDocument: ctx.client.code2ProtocolConverter.asTextDocumentIdentifier(editor.document),
        });
        if (!response)
            return;
        const uri = client.protocol2CodeConverter.asUri(response.uri);
        const range = client.protocol2CodeConverter.asRange(response.range);
        const doc = await vscode__default['default'].workspace.openTextDocument(uri);
        const e = await vscode__default['default'].window.showTextDocument(doc);
        e.selection = new vscode__default['default'].Selection(range.start, range.start);
        e.revealRange(range, vscode__default['default'].TextEditorRevealType.InCenter);
    };
}
exports.openCargoToml = openCargoToml;
function ssr(ctx) {
    return async () => {
        const editor = vscode__default['default'].window.activeTextEditor;
        const client = ctx.client;
        if (!editor || !client)
            return;
        const position = editor.selection.active;
        const selections = editor.selections;
        const textDocument = ctx.client.code2ProtocolConverter.asTextDocumentIdentifier(editor.document);
        const options = {
            value: "() ==>> ()",
            prompt: "Enter request, for example 'Foo($a) ==>> Foo::new($a)' ",
            validateInput: async (x) => {
                try {
                    await client.sendRequest(lsp_ext.ssr, {
                        query: x, parseOnly: true, textDocument, position, selections,
                    });
                }
                catch (e) {
                    return e.toString();
                }
                return null;
            }
        };
        const request = await vscode__default['default'].window.showInputBox(options);
        if (!request)
            return;
        vscode__default['default'].window.withProgress({
            location: vscode__default['default'].ProgressLocation.Notification,
            title: "Structured search replace in progress...",
            cancellable: false,
        }, async (_progress, _token) => {
            const edit = await client.sendRequest(lsp_ext.ssr, {
                query: request, parseOnly: false, textDocument, position, selections,
            });
            await vscode__default['default'].workspace.applyEdit(client.protocol2CodeConverter.asWorkspaceEdit(edit));
        });
    };
}
exports.ssr = ssr;
function serverVersion(ctx) {
    return async () => {
        const { stdout } = cp__default['default'].spawnSync(ctx.serverPath, ["--version"], { encoding: "utf8" });
        const commitHash = stdout.slice(`rust-analyzer `.length).trim();
        const { releaseTag } = ctx.config.package;
        void vscode__default['default'].window.showInformationMessage(`rust-analyzer version: ${releaseTag !== null && releaseTag !== void 0 ? releaseTag : "unreleased"} (${commitHash})`);
    };
}
exports.serverVersion = serverVersion;
function toggleInlayHints(ctx) {
    return async () => {
        await vscode__default['default']
            .workspace
            .getConfiguration(`${ctx.config.rootSection}.inlayHints`)
            .update('enable', !ctx.config.inlayHints.enable, vscode__default['default'].ConfigurationTarget.Workspace);
    };
}
exports.toggleInlayHints = toggleInlayHints;
// Opens the virtual file that will show the syntax tree
//
// The contents of the file come from the `TextDocumentContentProvider`
function syntaxTree(ctx) {
    const tdcp = new class {
        constructor() {
            this.uri = vscode__default['default'].Uri.parse('rust-analyzer://syntaxtree/tree.rast');
            this.eventEmitter = new vscode__default['default'].EventEmitter();
            vscode__default['default'].workspace.onDidChangeTextDocument(this.onDidChangeTextDocument, this, ctx.subscriptions);
            vscode__default['default'].window.onDidChangeActiveTextEditor(this.onDidChangeActiveTextEditor, this, ctx.subscriptions);
        }
        onDidChangeTextDocument(event) {
            if (util.isRustDocument(event.document)) {
                // We need to order this after language server updates, but there's no API for that.
                // Hence, good old sleep().
                void util.sleep(10).then(() => this.eventEmitter.fire(this.uri));
            }
        }
        onDidChangeActiveTextEditor(editor) {
            if (editor && util.isRustEditor(editor)) {
                this.eventEmitter.fire(this.uri);
            }
        }
        provideTextDocumentContent(uri, ct) {
            const rustEditor = ctx.activeRustEditor;
            if (!rustEditor)
                return '';
            // When the range based query is enabled we take the range of the selection
            const range = uri.query === 'range=true' && !rustEditor.selection.isEmpty
                ? ctx.client.code2ProtocolConverter.asRange(rustEditor.selection)
                : null;
            const params = { textDocument: { uri: rustEditor.document.uri.toString() }, range, };
            return ctx.client.sendRequest(lsp_ext.syntaxTree, params, ct);
        }
        get onDidChange() {
            return this.eventEmitter.event;
        }
    };
    void new ast_inspector.AstInspector(ctx);
    ctx.pushCleanup(vscode__default['default'].workspace.registerTextDocumentContentProvider('rust-analyzer', tdcp));
    ctx.pushCleanup(vscode__default['default'].languages.setLanguageConfiguration("ra_syntax_tree", {
        brackets: [["[", ")"]],
    }));
    return async () => {
        const editor = vscode__default['default'].window.activeTextEditor;
        const rangeEnabled = !!editor && !editor.selection.isEmpty;
        const uri = rangeEnabled
            ? vscode__default['default'].Uri.parse(`${tdcp.uri.toString()}?range=true`)
            : tdcp.uri;
        const document = await vscode__default['default'].workspace.openTextDocument(uri);
        tdcp.eventEmitter.fire(uri);
        void await vscode__default['default'].window.showTextDocument(document, {
            viewColumn: vscode__default['default'].ViewColumn.Two,
            preserveFocus: true
        });
    };
}
exports.syntaxTree = syntaxTree;
// Opens the virtual file that will show the HIR of the function containing the cursor position
//
// The contents of the file come from the `TextDocumentContentProvider`
function viewHir(ctx) {
    const tdcp = new class {
        constructor() {
            this.uri = vscode__default['default'].Uri.parse('rust-analyzer://viewHir/hir.txt');
            this.eventEmitter = new vscode__default['default'].EventEmitter();
            vscode__default['default'].workspace.onDidChangeTextDocument(this.onDidChangeTextDocument, this, ctx.subscriptions);
            vscode__default['default'].window.onDidChangeActiveTextEditor(this.onDidChangeActiveTextEditor, this, ctx.subscriptions);
        }
        onDidChangeTextDocument(event) {
            if (util.isRustDocument(event.document)) {
                // We need to order this after language server updates, but there's no API for that.
                // Hence, good old sleep().
                void util.sleep(10).then(() => this.eventEmitter.fire(this.uri));
            }
        }
        onDidChangeActiveTextEditor(editor) {
            if (editor && util.isRustEditor(editor)) {
                this.eventEmitter.fire(this.uri);
            }
        }
        provideTextDocumentContent(_uri, ct) {
            const rustEditor = ctx.activeRustEditor;
            const client = ctx.client;
            if (!rustEditor || !client)
                return '';
            const params = {
                textDocument: client.code2ProtocolConverter.asTextDocumentIdentifier(rustEditor.document),
                position: client.code2ProtocolConverter.asPosition(rustEditor.selection.active),
            };
            return client.sendRequest(lsp_ext.viewHir, params, ct);
        }
        get onDidChange() {
            return this.eventEmitter.event;
        }
    };
    ctx.pushCleanup(vscode__default['default'].workspace.registerTextDocumentContentProvider('rust-analyzer', tdcp));
    return async () => {
        const document = await vscode__default['default'].workspace.openTextDocument(tdcp.uri);
        tdcp.eventEmitter.fire(tdcp.uri);
        void await vscode__default['default'].window.showTextDocument(document, {
            viewColumn: vscode__default['default'].ViewColumn.Two,
            preserveFocus: true
        });
    };
}
exports.viewHir = viewHir;
// Opens the virtual file that will show the syntax tree
//
// The contents of the file come from the `TextDocumentContentProvider`
function expandMacro(ctx) {
    function codeFormat(expanded) {
        let result = `// Recursive expansion of ${expanded.name}! macro\n`;
        result += '// ' + '='.repeat(result.length - 3);
        result += '\n\n';
        result += expanded.expansion;
        return result;
    }
    const tdcp = new class {
        constructor() {
            this.uri = vscode__default['default'].Uri.parse('rust-analyzer://expandMacro/[EXPANSION].rs');
            this.eventEmitter = new vscode__default['default'].EventEmitter();
        }
        async provideTextDocumentContent(_uri) {
            const editor = vscode__default['default'].window.activeTextEditor;
            const client = ctx.client;
            if (!editor || !client)
                return '';
            const position = editor.selection.active;
            const expanded = await client.sendRequest(lsp_ext.expandMacro, {
                textDocument: ctx.client.code2ProtocolConverter.asTextDocumentIdentifier(editor.document),
                position,
            });
            if (expanded == null)
                return 'Not available';
            return codeFormat(expanded);
        }
        get onDidChange() {
            return this.eventEmitter.event;
        }
    }();
    ctx.pushCleanup(vscode__default['default'].workspace.registerTextDocumentContentProvider('rust-analyzer', tdcp));
    return async () => {
        const document = await vscode__default['default'].workspace.openTextDocument(tdcp.uri);
        tdcp.eventEmitter.fire(tdcp.uri);
        return vscode__default['default'].window.showTextDocument(document, vscode__default['default'].ViewColumn.Two, true);
    };
}
exports.expandMacro = expandMacro;
function reloadWorkspace(ctx) {
    return async () => ctx.client.sendRequest(lsp_ext.reloadWorkspace);
}
exports.reloadWorkspace = reloadWorkspace;
function showReferences(ctx) {
    return (uri, position, locations) => {
        const client = ctx.client;
        if (client) {
            vscode__default['default'].commands.executeCommand('editor.action.showReferences', vscode__default['default'].Uri.parse(uri), client.protocol2CodeConverter.asPosition(position), locations.map(client.protocol2CodeConverter.asLocation));
        }
    };
}
exports.showReferences = showReferences;
function applyActionGroup(_ctx) {
    return async (actions) => {
        const selectedAction = await vscode__default['default'].window.showQuickPick(actions);
        if (!selectedAction)
            return;
        vscode__default['default'].commands.executeCommand('rust-analyzer.resolveCodeAction', selectedAction.arguments);
    };
}
exports.applyActionGroup = applyActionGroup;
function gotoLocation(ctx) {
    return async (locationLink) => {
        const client = ctx.client;
        if (client) {
            const uri = client.protocol2CodeConverter.asUri(locationLink.targetUri);
            let range = client.protocol2CodeConverter.asRange(locationLink.targetSelectionRange);
            // collapse the range to a cursor position
            range = range.with({ end: range.start });
            await vscode__default['default'].window.showTextDocument(uri, { selection: range });
        }
    };
}
exports.gotoLocation = gotoLocation;
function openDocs(ctx) {
    return async () => {
        const client = ctx.client;
        const editor = vscode__default['default'].window.activeTextEditor;
        if (!editor || !client) {
            return;
        }
        const position = editor.selection.active;
        const textDocument = { uri: editor.document.uri.toString() };
        const doclink = await client.sendRequest(lsp_ext.openDocs, { position, textDocument });
        if (doclink != null) {
            vscode__default['default'].commands.executeCommand("vscode.open", vscode__default['default'].Uri.parse(doclink));
        }
    };
}
exports.openDocs = openDocs;
function resolveCodeAction(ctx) {
    const client = ctx.client;
    return async (params) => {
        var _a;
        params.command = undefined;
        const item = await client.sendRequest(main$3.CodeActionResolveRequest.type, params);
        if (!item.edit) {
            return;
        }
        const itemEdit = item.edit;
        const edit = client.protocol2CodeConverter.asWorkspaceEdit(itemEdit);
        // filter out all text edits and recreate the WorkspaceEdit without them so we can apply
        // snippet edits on our own
        const itemEditWithoutTextEdits = { ...item, documentChanges: (_a = itemEdit.documentChanges) === null || _a === void 0 ? void 0 : _a.filter(change => "kind" in change) };
        const editWithoutTextEdits = client.protocol2CodeConverter.asWorkspaceEdit(itemEditWithoutTextEdits);
        await snippets.applySnippetWorkspaceEdit(edit);
        await vscode__default['default'].workspace.applyEdit(editWithoutTextEdits);
    };
}
exports.resolveCodeAction = resolveCodeAction;
function applySnippetWorkspaceEditCommand(_ctx) {
    return async (edit) => {
        await snippets.applySnippetWorkspaceEdit(edit);
    };
}
exports.applySnippetWorkspaceEditCommand = applySnippetWorkspaceEditCommand;
function run$1(ctx) {
    let prevRunnable;
    return async () => {
        const item = await run.selectRunnable(ctx, prevRunnable);
        if (!item)
            return;
        item.detail = 'rerun';
        prevRunnable = item;
        const task = await run.createTask(item.runnable, ctx.config);
        return await vscode__default['default'].tasks.executeTask(task);
    };
}
exports.run = run$1;
function runSingle(ctx) {
    return async (runnable) => {
        const editor = ctx.activeRustEditor;
        if (!editor)
            return;
        const task = await run.createTask(runnable, ctx.config);
        task.group = vscode__default['default'].TaskGroup.Build;
        task.presentationOptions = {
            reveal: vscode__default['default'].TaskRevealKind.Always,
            panel: vscode__default['default'].TaskPanelKind.Dedicated,
            clear: true,
        };
        return vscode__default['default'].tasks.executeTask(task);
    };
}
exports.runSingle = runSingle;
function debug(ctx) {
    let prevDebuggee;
    return async () => {
        const item = await run.selectRunnable(ctx, prevDebuggee, true);
        if (!item)
            return;
        item.detail = 'restart';
        prevDebuggee = item;
        return await debug$1.startDebugSession(ctx, item.runnable);
    };
}
exports.debug = debug;
function debugSingle(ctx) {
    return async (config) => {
        await debug$1.startDebugSession(ctx, config);
    };
}
exports.debugSingle = debugSingle;
function newDebugConfig(ctx) {
    return async () => {
        const item = await run.selectRunnable(ctx, undefined, true, false);
        if (!item)
            return;
        await debug$1.makeDebugConfig(ctx, item.runnable);
    };
}
exports.newDebugConfig = newDebugConfig;

});

var inlay_hints = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.activateInlayHints = void 0;



function activateInlayHints(ctx) {
    const maybeUpdater = {
        updater: null,
        async onConfigChange() {
            const anyEnabled = ctx.config.inlayHints.typeHints
                || ctx.config.inlayHints.parameterHints
                || ctx.config.inlayHints.chainingHints;
            const enabled = ctx.config.inlayHints.enable && anyEnabled;
            if (!enabled)
                return this.dispose();
            await util.sleep(100);
            if (this.updater) {
                this.updater.syncCacheAndRenderHints();
            }
            else {
                this.updater = new HintsUpdater(ctx);
            }
        },
        dispose() {
            var _a;
            (_a = this.updater) === null || _a === void 0 ? void 0 : _a.dispose();
            this.updater = null;
        }
    };
    ctx.pushCleanup(maybeUpdater);
    vscode__default['default'].workspace.onDidChangeConfiguration(maybeUpdater.onConfigChange, maybeUpdater, ctx.subscriptions);
    maybeUpdater.onConfigChange();
}
exports.activateInlayHints = activateInlayHints;
const typeHints = createHintStyle("type");
const paramHints = createHintStyle("parameter");
const chainingHints = createHintStyle("chaining");
function createHintStyle(hintKind) {
    // U+200C is a zero-width non-joiner to prevent the editor from forming a ligature
    // between code and type hints
    const [pos, render] = {
        type: ["after", (label) => `\u{200c}: ${label}`],
        parameter: ["before", (label) => `${label}: `],
        chaining: ["after", (label) => `\u{200c}: ${label}`],
    }[hintKind];
    const fg = new vscode__default['default'].ThemeColor(`rust_analyzer.inlayHints.foreground.${hintKind}Hints`);
    const bg = new vscode__default['default'].ThemeColor(`rust_analyzer.inlayHints.background.${hintKind}Hints`);
    return {
        decorationType: vscode__default['default'].window.createTextEditorDecorationType({
            [pos]: {
                color: fg,
                backgroundColor: bg,
                fontStyle: "normal",
                fontWeight: "normal",
                textDecoration: ";font-size:smaller",
            },
        }),
        toDecoration(hint, conv) {
            return {
                range: conv.asRange(hint.range),
                renderOptions: { [pos]: { contentText: render(hint.label) } }
            };
        }
    };
}
class HintsUpdater {
    constructor(ctx) {
        this.ctx = ctx;
        this.sourceFiles = new Map(); // map Uri -> RustSourceFile
        this.disposables = [];
        vscode__default['default'].window.onDidChangeVisibleTextEditors(this.onDidChangeVisibleTextEditors, this, this.disposables);
        vscode__default['default'].workspace.onDidChangeTextDocument(this.onDidChangeTextDocument, this, this.disposables);
        // Set up initial cache shape
        ctx.visibleRustEditors.forEach(editor => this.sourceFiles.set(editor.document.uri.toString(), {
            document: editor.document,
            inlaysRequest: null,
            cachedDecorations: null
        }));
        this.syncCacheAndRenderHints();
    }
    dispose() {
        this.sourceFiles.forEach(file => { var _a; return (_a = file.inlaysRequest) === null || _a === void 0 ? void 0 : _a.cancel(); });
        this.ctx.visibleRustEditors.forEach(editor => this.renderDecorations(editor, { param: [], type: [], chaining: [] }));
        this.disposables.forEach(d => d.dispose());
    }
    onDidChangeTextDocument({ contentChanges, document }) {
        if (contentChanges.length === 0 || !util.isRustDocument(document))
            return;
        this.syncCacheAndRenderHints();
    }
    syncCacheAndRenderHints() {
        this.sourceFiles.forEach((file, uri) => this.fetchHints(file).then(hints => {
            if (!hints)
                return;
            file.cachedDecorations = this.hintsToDecorations(hints);
            for (const editor of this.ctx.visibleRustEditors) {
                if (editor.document.uri.toString() === uri) {
                    this.renderDecorations(editor, file.cachedDecorations);
                }
            }
        }));
    }
    onDidChangeVisibleTextEditors() {
        const newSourceFiles = new Map();
        // Rerendering all, even up-to-date editors for simplicity
        this.ctx.visibleRustEditors.forEach(async (editor) => {
            var _a;
            const uri = editor.document.uri.toString();
            const file = (_a = this.sourceFiles.get(uri)) !== null && _a !== void 0 ? _a : {
                document: editor.document,
                inlaysRequest: null,
                cachedDecorations: null
            };
            newSourceFiles.set(uri, file);
            // No text documents changed, so we may try to use the cache
            if (!file.cachedDecorations) {
                const hints = await this.fetchHints(file);
                if (!hints)
                    return;
                file.cachedDecorations = this.hintsToDecorations(hints);
            }
            this.renderDecorations(editor, file.cachedDecorations);
        });
        // Cancel requests for no longer visible (disposed) source files
        this.sourceFiles.forEach((file, uri) => {
            var _a;
            if (!newSourceFiles.has(uri))
                (_a = file.inlaysRequest) === null || _a === void 0 ? void 0 : _a.cancel();
        });
        this.sourceFiles = newSourceFiles;
    }
    renderDecorations(editor, decorations) {
        editor.setDecorations(typeHints.decorationType, decorations.type);
        editor.setDecorations(paramHints.decorationType, decorations.param);
        editor.setDecorations(chainingHints.decorationType, decorations.chaining);
    }
    hintsToDecorations(hints) {
        const decorations = { type: [], param: [], chaining: [] };
        const conv = this.ctx.client.protocol2CodeConverter;
        for (const hint of hints) {
            switch (hint.kind) {
                case "TypeHint" /* TypeHint */: {
                    decorations.type.push(typeHints.toDecoration(hint, conv));
                    continue;
                }
                case "ParameterHint" /* ParamHint */: {
                    decorations.param.push(paramHints.toDecoration(hint, conv));
                    continue;
                }
                case "ChainingHint" /* ChainingHint */: {
                    decorations.chaining.push(chainingHints.toDecoration(hint, conv));
                    continue;
                }
            }
        }
        return decorations;
    }
    async fetchHints(file) {
        var _a;
        (_a = file.inlaysRequest) === null || _a === void 0 ? void 0 : _a.cancel();
        const tokenSource = new vscode__default['default'].CancellationTokenSource();
        file.inlaysRequest = tokenSource;
        const request = { textDocument: { uri: file.document.uri.toString() } };
        return util.sendRequestWithRetry(this.ctx.client, lsp_ext.inlayHints, request, tokenSource.token)
            .catch(_ => null)
            .finally(() => {
            if (file.inlaysRequest === tokenSource) {
                file.inlaysRequest = null;
            }
        });
    }
}

});

var client$1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.createClient = void 0;




const vscode_1 = vscode__default['default'];
function renderCommand(cmd) {
    return `[${cmd.title}](command:${cmd.command}?${encodeURIComponent(JSON.stringify(cmd.arguments))} '${cmd.tooltip}')`;
}
function renderHoverActions(actions) {
    const text = actions.map(group => (group.title ? (group.title + " ") : "") + group.commands.map(renderCommand).join(' | ')).join('___');
    const result = new vscode__default['default'].MarkdownString(text);
    result.isTrusted = true;
    return result;
}
// Workaround for https://github.com/microsoft/vscode-languageserver-node/issues/576
async function semanticHighlightingWorkaround(next, ...args) {
    const res = await next(...args);
    if (res == null)
        throw new Error('busy');
    return res;
}
function createClient(serverPath, cwd, extraEnv) {
    // '.' Is the fallback if no folder is open
    // TODO?: Workspace folders support Uri's (eg: file://test.txt).
    // It might be a good idea to test if the uri points to a file.
    const newEnv = Object.assign({}, process.env);
    Object.assign(newEnv, extraEnv);
    const run = {
        command: serverPath,
        options: { cwd, env: newEnv },
    };
    const serverOptions = {
        run,
        debug: run,
    };
    const traceOutputChannel = vscode__default['default'].window.createOutputChannel('Rust Analyzer Language Server Trace');
    const clientOptions = {
        documentSelector: [{ scheme: 'file', language: 'rust' }],
        initializationOptions: vscode__default['default'].workspace.getConfiguration("rust-analyzer"),
        diagnosticCollectionName: "rustc",
        traceOutputChannel,
        middleware: {
            provideDocumentSemanticTokens(document, token, next) {
                return semanticHighlightingWorkaround(next, document, token);
            },
            provideDocumentSemanticTokensEdits(document, previousResultId, token, next) {
                return semanticHighlightingWorkaround(next, document, previousResultId, token);
            },
            provideDocumentRangeSemanticTokens(document, range, token, next) {
                return semanticHighlightingWorkaround(next, document, range, token);
            },
            async provideHover(document, position, token, _next) {
                return client.sendRequest(node$2.HoverRequest.type, client.code2ProtocolConverter.asTextDocumentPositionParams(document, position), token).then((result) => {
                    const hover = client.protocol2CodeConverter.asHover(result);
                    if (hover) {
                        const actions = result.actions;
                        if (actions) {
                            hover.contents.push(renderHoverActions(actions));
                        }
                    }
                    return hover;
                }, (error) => {
                    client.handleFailedRequest(node$2.HoverRequest.type, error, null);
                    return Promise.resolve(null);
                });
            },
            // Using custom handling of CodeActions to support action groups and snippet edits.
            // Note that this means we have to re-implement lazy edit resolving ourselves as well.
            async provideCodeActions(document, range, context, token, _next) {
                const params = {
                    textDocument: client.code2ProtocolConverter.asTextDocumentIdentifier(document),
                    range: client.code2ProtocolConverter.asRange(range),
                    context: client.code2ProtocolConverter.asCodeActionContext(context)
                };
                return client.sendRequest(node$2.CodeActionRequest.type, params, token).then((values) => {
                    if (values === null)
                        return undefined;
                    const result = [];
                    const groups = new Map();
                    for (const item of values) {
                        // In our case we expect to get code edits only from diagnostics
                        if (node$2.CodeAction.is(item)) {
                            util.assert(!item.command, "We don't expect to receive commands in CodeActions");
                            const action = client.protocol2CodeConverter.asCodeAction(item);
                            result.push(action);
                            continue;
                        }
                        util.assert(isCodeActionWithoutEditsAndCommands(item), "We don't expect edits or commands here");
                        const kind = client.protocol2CodeConverter.asCodeActionKind(item.kind);
                        const action = new vscode__default['default'].CodeAction(item.title, kind);
                        const group = item.group;
                        action.command = {
                            command: "rust-analyzer.resolveCodeAction",
                            title: item.title,
                            arguments: [item],
                        };
                        // Set a dummy edit, so that VS Code doesn't try to resolve this.
                        action.edit = new vscode_1.WorkspaceEdit();
                        if (group) {
                            let entry = groups.get(group);
                            if (!entry) {
                                entry = { index: result.length, items: [] };
                                groups.set(group, entry);
                                result.push(action);
                            }
                            entry.items.push(action);
                        }
                        else {
                            result.push(action);
                        }
                    }
                    for (const [group, { index, items }] of groups) {
                        if (items.length === 1) {
                            result[index] = items[0];
                        }
                        else {
                            const action = new vscode__default['default'].CodeAction(group);
                            action.kind = items[0].kind;
                            action.command = {
                                command: "rust-analyzer.applyActionGroup",
                                title: "",
                                arguments: [items.map((item) => {
                                        return { label: item.title, arguments: item.command.arguments[0] };
                                    })],
                            };
                            // Set a dummy edit, so that VS Code doesn't try to resolve this.
                            action.edit = new vscode_1.WorkspaceEdit();
                            result[index] = action;
                        }
                    }
                    return result;
                }, (_error) => undefined);
            }
        }
    };
    const client = new node$2.LanguageClient('rust-analyzer', 'Rust Analyzer Language Server', serverOptions, clientOptions);
    // To turn on all proposed features use: client.registerProposedFeatures();
    client.registerFeature(new ExperimentalFeatures());
    return client;
}
exports.createClient = createClient;
class ExperimentalFeatures {
    fillClientCapabilities(capabilities) {
        var _a;
        const caps = (_a = capabilities.experimental) !== null && _a !== void 0 ? _a : {};
        caps.snippetTextEdit = true;
        caps.codeActionGroup = true;
        caps.hoverActions = true;
        caps.statusNotification = true;
        capabilities.experimental = caps;
    }
    initialize(_capabilities, _documentSelector) {
    }
    dispose() {
    }
}
function isCodeActionWithoutEditsAndCommands(value) {
    const candidate = value;
    return candidate && is.string(candidate.title) &&
        (candidate.diagnostics === void 0 || is.typedArray(candidate.diagnostics, node$2.Diagnostic.is)) &&
        (candidate.kind === void 0 || is.string(candidate.kind)) &&
        (candidate.edit === void 0 && candidate.command === void 0);
}

});

var ctx = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ctx = void 0;




class Ctx {
    constructor(config, extCtx, client, serverPath, statusBar) {
        this.config = config;
        this.extCtx = extCtx;
        this.client = client;
        this.serverPath = serverPath;
        this.statusBar = statusBar;
    }
    static async create(config, extCtx, serverPath, cwd) {
        const client = client$1.createClient(serverPath, cwd, config.serverExtraEnv);
        const statusBar = vscode__default['default'].window.createStatusBarItem(vscode__default['default'].StatusBarAlignment.Left);
        extCtx.subscriptions.push(statusBar);
        statusBar.text = "rust-analyzer";
        statusBar.tooltip = "ready";
        statusBar.show();
        const res = new Ctx(config, extCtx, client, serverPath, statusBar);
        res.pushCleanup(client.start());
        await client.onReady();
        client.onNotification(lsp_ext.status, (params) => res.setStatus(params.status));
        return res;
    }
    get activeRustEditor() {
        const editor = vscode__default['default'].window.activeTextEditor;
        return editor && util.isRustEditor(editor)
            ? editor
            : undefined;
    }
    get visibleRustEditors() {
        return vscode__default['default'].window.visibleTextEditors.filter(util.isRustEditor);
    }
    registerCommand(name, factory) {
        const fullName = `rust-analyzer.${name}`;
        const cmd = factory(this);
        const d = vscode__default['default'].commands.registerCommand(fullName, cmd);
        this.pushCleanup(d);
    }
    get globalState() {
        return this.extCtx.globalState;
    }
    get subscriptions() {
        return this.extCtx.subscriptions;
    }
    setStatus(status) {
        switch (status) {
            case "loading":
                this.statusBar.text = "$(sync~spin) rust-analyzer";
                this.statusBar.tooltip = "Loading the project";
                this.statusBar.command = undefined;
                this.statusBar.color = undefined;
                break;
            case "ready":
                this.statusBar.text = "rust-analyzer";
                this.statusBar.tooltip = "Ready";
                this.statusBar.command = undefined;
                this.statusBar.color = undefined;
                break;
            case "invalid":
                this.statusBar.text = "$(error) rust-analyzer";
                this.statusBar.tooltip = "Failed to load the project";
                this.statusBar.command = undefined;
                this.statusBar.color = new vscode__default['default'].ThemeColor("notificationsErrorIcon.foreground");
                break;
            case "needsReload":
                this.statusBar.text = "$(warning) rust-analyzer";
                this.statusBar.tooltip = "Click to reload";
                this.statusBar.command = "rust-analyzer.reloadWorkspace";
                this.statusBar.color = new vscode__default['default'].ThemeColor("notificationsWarningIcon.foreground");
                break;
        }
    }
    pushCleanup(d) {
        this.extCtx.subscriptions.push(d);
    }
}
exports.Ctx = Ctx;

});

var config = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = exports.NIGHTLY_TAG = void 0;


exports.NIGHTLY_TAG = "nightly";
class Config {
    constructor(ctx) {
        this.extensionId = "matklad.rust-analyzer";
        this.rootSection = "rust-analyzer";
        this.requiresReloadOpts = [
            "serverPath",
            "server",
            "cargo",
            "procMacro",
            "files",
            "highlighting",
            "updates.channel",
            "lens",
            "hoverActions",
        ]
            .map(opt => `${this.rootSection}.${opt}`);
        this.package = vscode__default['default'].extensions.getExtension(this.extensionId).packageJSON;
        this.globalStoragePath = ctx.globalStoragePath;
        vscode__default['default'].workspace.onDidChangeConfiguration(this.onDidChangeConfiguration, this, ctx.subscriptions);
        this.refreshLogging();
    }
    refreshLogging() {
        util.log.setEnabled(this.traceExtension);
        util.log.info("Extension version:", this.package.version);
        const cfg = Object.entries(this.cfg).filter(([_, val]) => !(val instanceof Function));
        util.log.info("Using configuration", Object.fromEntries(cfg));
    }
    async onDidChangeConfiguration(event) {
        this.refreshLogging();
        const requiresReloadOpt = this.requiresReloadOpts.find(opt => event.affectsConfiguration(opt));
        if (!requiresReloadOpt)
            return;
        const userResponse = await vscode__default['default'].window.showInformationMessage(`Changing "${requiresReloadOpt}" requires a reload`, "Reload now");
        if (userResponse === "Reload now") {
            await vscode__default['default'].commands.executeCommand("workbench.action.reloadWindow");
        }
    }
    // We don't do runtime config validation here for simplicity. More on stackoverflow:
    // https://stackoverflow.com/questions/60135780/what-is-the-best-way-to-type-check-the-configuration-for-vscode-extension
    get cfg() {
        return vscode__default['default'].workspace.getConfiguration(this.rootSection);
    }
    /**
     * Beware that postfix `!` operator erases both `null` and `undefined`.
     * This is why the following doesn't work as expected:
     *
     * ```ts
     * const nullableNum = vscode
     *  .workspace
     *  .getConfiguration
     *  .getConfiguration("rust-analyer")
     *  .get<number | null>(path)!;
     *
     * // What happens is that type of `nullableNum` is `number` but not `null | number`:
     * const fullFledgedNum: number = nullableNum;
     * ```
     * So this getter handles this quirk by not requiring the caller to use postfix `!`
     */
    get(path) {
        return this.cfg.get(path);
    }
    get serverPath() {
        var _a;
        return (_a = this.get("server.path")) !== null && _a !== void 0 ? _a : this.get("serverPath");
    }
    get serverExtraEnv() { var _a; return (_a = this.get("server.extraEnv")) !== null && _a !== void 0 ? _a : {}; }
    get channel() { return this.get("updates.channel"); }
    get askBeforeDownload() { return this.get("updates.askBeforeDownload"); }
    get traceExtension() { return this.get("trace.extension"); }
    get inlayHints() {
        return {
            enable: this.get("inlayHints.enable"),
            typeHints: this.get("inlayHints.typeHints"),
            parameterHints: this.get("inlayHints.parameterHints"),
            chainingHints: this.get("inlayHints.chainingHints"),
            maxLength: this.get("inlayHints.maxLength"),
        };
    }
    get checkOnSave() {
        return {
            command: this.get("checkOnSave.command"),
        };
    }
    get cargoRunner() {
        return this.get("cargoRunner");
    }
    get runnableEnv() {
        return this.get("runnableEnv");
    }
    get debug() {
        // "/rustc/<id>" used by suggestions only.
        const { ["/rustc/<id>"]: _, ...sourceFileMap } = this.get("debug.sourceFileMap");
        return {
            engine: this.get("debug.engine"),
            engineSettings: this.get("debug.engineSettings"),
            openDebugPane: this.get("debug.openDebugPane"),
            sourceFileMap: sourceFileMap
        };
    }
    get lens() {
        return {
            enable: this.get("lens.enable"),
            run: this.get("lens.run"),
            debug: this.get("lens.debug"),
            implementations: this.get("lens.implementations"),
            methodReferences: this.get("lens.methodReferences"),
        };
    }
    get hoverActions() {
        return {
            enable: this.get("hoverActions.enable"),
            implementations: this.get("hoverActions.implementations"),
            run: this.get("hoverActions.run"),
            debug: this.get("hoverActions.debug"),
            gotoTypeDef: this.get("hoverActions.gotoTypeDef"),
        };
    }
}
exports.Config = Config;

});

var persistent_state = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersistentState = void 0;

class PersistentState {
    constructor(globalState) {
        this.globalState = globalState;
        const { lastCheck, releaseId, serverVersion } = this;
        util.log.info("PersistentState:", { lastCheck, releaseId, serverVersion });
    }
    /**
     * Used to check for *nightly* updates once an hour.
     */
    get lastCheck() {
        return this.globalState.get("lastCheck");
    }
    async updateLastCheck(value) {
        await this.globalState.update("lastCheck", value);
    }
    /**
     * Release id of the *nightly* extension.
     * Used to check if we should update.
     */
    get releaseId() {
        return this.globalState.get("releaseId");
    }
    async updateReleaseId(value) {
        await this.globalState.update("releaseId", value);
    }
    /**
     * Version of the extension that installed the server.
     * Used to check if we need to update the server.
     */
    get serverVersion() {
        return this.globalState.get("serverVersion");
    }
    async updateServerVersion(value) {
        await this.globalState.update("serverVersion", value);
    }
    /**
     * Github authorization token.
     * This is used for API requests against the Github API.
     */
    get githubToken() {
        return this.globalState.get("githubToken");
    }
    async updateGithubToken(value) {
        await this.globalState.update("githubToken", value);
    }
}
exports.PersistentState = PersistentState;

});

// Based on https://github.com/tmpvar/jsdom/blob/aa85b2abf07766ff7bf5c1f6daafb3726f2f2db5/lib/jsdom/living/blob.js

// fix for "Readable" isn't a named export issue
const Readable = Stream__default['default'].Readable;

const BUFFER = Symbol('buffer');
const TYPE = Symbol('type');

class Blob {
	constructor() {
		this[TYPE] = '';

		const blobParts = arguments[0];
		const options = arguments[1];

		const buffers = [];
		let size = 0;

		if (blobParts) {
			const a = blobParts;
			const length = Number(a.length);
			for (let i = 0; i < length; i++) {
				const element = a[i];
				let buffer;
				if (element instanceof Buffer) {
					buffer = element;
				} else if (ArrayBuffer.isView(element)) {
					buffer = Buffer.from(element.buffer, element.byteOffset, element.byteLength);
				} else if (element instanceof ArrayBuffer) {
					buffer = Buffer.from(element);
				} else if (element instanceof Blob) {
					buffer = element[BUFFER];
				} else {
					buffer = Buffer.from(typeof element === 'string' ? element : String(element));
				}
				size += buffer.length;
				buffers.push(buffer);
			}
		}

		this[BUFFER] = Buffer.concat(buffers);

		let type = options && options.type !== undefined && String(options.type).toLowerCase();
		if (type && !/[^\u0020-\u007E]/.test(type)) {
			this[TYPE] = type;
		}
	}
	get size() {
		return this[BUFFER].length;
	}
	get type() {
		return this[TYPE];
	}
	text() {
		return Promise.resolve(this[BUFFER].toString());
	}
	arrayBuffer() {
		const buf = this[BUFFER];
		const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
		return Promise.resolve(ab);
	}
	stream() {
		const readable = new Readable();
		readable._read = function () {};
		readable.push(this[BUFFER]);
		readable.push(null);
		return readable;
	}
	toString() {
		return '[object Blob]';
	}
	slice() {
		const size = this.size;

		const start = arguments[0];
		const end = arguments[1];
		let relativeStart, relativeEnd;
		if (start === undefined) {
			relativeStart = 0;
		} else if (start < 0) {
			relativeStart = Math.max(size + start, 0);
		} else {
			relativeStart = Math.min(start, size);
		}
		if (end === undefined) {
			relativeEnd = size;
		} else if (end < 0) {
			relativeEnd = Math.max(size + end, 0);
		} else {
			relativeEnd = Math.min(end, size);
		}
		const span = Math.max(relativeEnd - relativeStart, 0);

		const buffer = this[BUFFER];
		const slicedBuffer = buffer.slice(relativeStart, relativeStart + span);
		const blob = new Blob([], { type: arguments[2] });
		blob[BUFFER] = slicedBuffer;
		return blob;
	}
}

Object.defineProperties(Blob.prototype, {
	size: { enumerable: true },
	type: { enumerable: true },
	slice: { enumerable: true }
});

Object.defineProperty(Blob.prototype, Symbol.toStringTag, {
	value: 'Blob',
	writable: false,
	enumerable: false,
	configurable: true
});

/**
 * fetch-error.js
 *
 * FetchError interface for operational errors
 */

/**
 * Create FetchError instance
 *
 * @param   String      message      Error message for human
 * @param   String      type         Error type for machine
 * @param   String      systemError  For Node.js system error
 * @return  FetchError
 */
function FetchError(message, type, systemError) {
  Error.call(this, message);

  this.message = message;
  this.type = type;

  // when err.type is `system`, err.code contains system error code
  if (systemError) {
    this.code = this.errno = systemError.code;
  }

  // hide custom error implementation details from end-users
  Error.captureStackTrace(this, this.constructor);
}

FetchError.prototype = Object.create(Error.prototype);
FetchError.prototype.constructor = FetchError;
FetchError.prototype.name = 'FetchError';

let convert;
try {
	convert = require('encoding').convert;
} catch (e) {}

const INTERNALS = Symbol('Body internals');

// fix an issue where "PassThrough" isn't a named export for node <10
const PassThrough = Stream__default['default'].PassThrough;

/**
 * Body mixin
 *
 * Ref: https://fetch.spec.whatwg.org/#body
 *
 * @param   Stream  body  Readable stream
 * @param   Object  opts  Response options
 * @return  Void
 */
function Body(body) {
	var _this = this;

	var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
	    _ref$size = _ref.size;

	let size = _ref$size === undefined ? 0 : _ref$size;
	var _ref$timeout = _ref.timeout;
	let timeout = _ref$timeout === undefined ? 0 : _ref$timeout;

	if (body == null) {
		// body is undefined or null
		body = null;
	} else if (isURLSearchParams(body)) {
		// body is a URLSearchParams
		body = Buffer.from(body.toString());
	} else if (isBlob(body)) ; else if (Buffer.isBuffer(body)) ; else if (Object.prototype.toString.call(body) === '[object ArrayBuffer]') {
		// body is ArrayBuffer
		body = Buffer.from(body);
	} else if (ArrayBuffer.isView(body)) {
		// body is ArrayBufferView
		body = Buffer.from(body.buffer, body.byteOffset, body.byteLength);
	} else if (body instanceof Stream__default['default']) ; else {
		// none of the above
		// coerce to string then buffer
		body = Buffer.from(String(body));
	}
	this[INTERNALS] = {
		body,
		disturbed: false,
		error: null
	};
	this.size = size;
	this.timeout = timeout;

	if (body instanceof Stream__default['default']) {
		body.on('error', function (err) {
			const error = err.name === 'AbortError' ? err : new FetchError(`Invalid response body while trying to fetch ${_this.url}: ${err.message}`, 'system', err);
			_this[INTERNALS].error = error;
		});
	}
}

Body.prototype = {
	get body() {
		return this[INTERNALS].body;
	},

	get bodyUsed() {
		return this[INTERNALS].disturbed;
	},

	/**
  * Decode response as ArrayBuffer
  *
  * @return  Promise
  */
	arrayBuffer() {
		return consumeBody.call(this).then(function (buf) {
			return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
		});
	},

	/**
  * Return raw response as Blob
  *
  * @return Promise
  */
	blob() {
		let ct = this.headers && this.headers.get('content-type') || '';
		return consumeBody.call(this).then(function (buf) {
			return Object.assign(
			// Prevent copying
			new Blob([], {
				type: ct.toLowerCase()
			}), {
				[BUFFER]: buf
			});
		});
	},

	/**
  * Decode response as json
  *
  * @return  Promise
  */
	json() {
		var _this2 = this;

		return consumeBody.call(this).then(function (buffer) {
			try {
				return JSON.parse(buffer.toString());
			} catch (err) {
				return Body.Promise.reject(new FetchError(`invalid json response body at ${_this2.url} reason: ${err.message}`, 'invalid-json'));
			}
		});
	},

	/**
  * Decode response as text
  *
  * @return  Promise
  */
	text() {
		return consumeBody.call(this).then(function (buffer) {
			return buffer.toString();
		});
	},

	/**
  * Decode response as buffer (non-spec api)
  *
  * @return  Promise
  */
	buffer() {
		return consumeBody.call(this);
	},

	/**
  * Decode response as text, while automatically detecting the encoding and
  * trying to decode to UTF-8 (non-spec api)
  *
  * @return  Promise
  */
	textConverted() {
		var _this3 = this;

		return consumeBody.call(this).then(function (buffer) {
			return convertBody(buffer, _this3.headers);
		});
	}
};

// In browsers, all properties are enumerable.
Object.defineProperties(Body.prototype, {
	body: { enumerable: true },
	bodyUsed: { enumerable: true },
	arrayBuffer: { enumerable: true },
	blob: { enumerable: true },
	json: { enumerable: true },
	text: { enumerable: true }
});

Body.mixIn = function (proto) {
	for (const name of Object.getOwnPropertyNames(Body.prototype)) {
		// istanbul ignore else: future proof
		if (!(name in proto)) {
			const desc = Object.getOwnPropertyDescriptor(Body.prototype, name);
			Object.defineProperty(proto, name, desc);
		}
	}
};

/**
 * Consume and convert an entire Body to a Buffer.
 *
 * Ref: https://fetch.spec.whatwg.org/#concept-body-consume-body
 *
 * @return  Promise
 */
function consumeBody() {
	var _this4 = this;

	if (this[INTERNALS].disturbed) {
		return Body.Promise.reject(new TypeError(`body used already for: ${this.url}`));
	}

	this[INTERNALS].disturbed = true;

	if (this[INTERNALS].error) {
		return Body.Promise.reject(this[INTERNALS].error);
	}

	let body = this.body;

	// body is null
	if (body === null) {
		return Body.Promise.resolve(Buffer.alloc(0));
	}

	// body is blob
	if (isBlob(body)) {
		body = body.stream();
	}

	// body is buffer
	if (Buffer.isBuffer(body)) {
		return Body.Promise.resolve(body);
	}

	// istanbul ignore if: should never happen
	if (!(body instanceof Stream__default['default'])) {
		return Body.Promise.resolve(Buffer.alloc(0));
	}

	// body is stream
	// get ready to actually consume the body
	let accum = [];
	let accumBytes = 0;
	let abort = false;

	return new Body.Promise(function (resolve, reject) {
		let resTimeout;

		// allow timeout on slow response body
		if (_this4.timeout) {
			resTimeout = setTimeout(function () {
				abort = true;
				reject(new FetchError(`Response timeout while trying to fetch ${_this4.url} (over ${_this4.timeout}ms)`, 'body-timeout'));
			}, _this4.timeout);
		}

		// handle stream errors
		body.on('error', function (err) {
			if (err.name === 'AbortError') {
				// if the request was aborted, reject with this Error
				abort = true;
				reject(err);
			} else {
				// other errors, such as incorrect content-encoding
				reject(new FetchError(`Invalid response body while trying to fetch ${_this4.url}: ${err.message}`, 'system', err));
			}
		});

		body.on('data', function (chunk) {
			if (abort || chunk === null) {
				return;
			}

			if (_this4.size && accumBytes + chunk.length > _this4.size) {
				abort = true;
				reject(new FetchError(`content size at ${_this4.url} over limit: ${_this4.size}`, 'max-size'));
				return;
			}

			accumBytes += chunk.length;
			accum.push(chunk);
		});

		body.on('end', function () {
			if (abort) {
				return;
			}

			clearTimeout(resTimeout);

			try {
				resolve(Buffer.concat(accum, accumBytes));
			} catch (err) {
				// handle streams that have accumulated too much data (issue #414)
				reject(new FetchError(`Could not create Buffer from response body for ${_this4.url}: ${err.message}`, 'system', err));
			}
		});
	});
}

/**
 * Detect buffer encoding and convert to target encoding
 * ref: http://www.w3.org/TR/2011/WD-html5-20110113/parsing.html#determining-the-character-encoding
 *
 * @param   Buffer  buffer    Incoming buffer
 * @param   String  encoding  Target encoding
 * @return  String
 */
function convertBody(buffer, headers) {
	if (typeof convert !== 'function') {
		throw new Error('The package `encoding` must be installed to use the textConverted() function');
	}

	const ct = headers.get('content-type');
	let charset = 'utf-8';
	let res, str;

	// header
	if (ct) {
		res = /charset=([^;]*)/i.exec(ct);
	}

	// no charset in content type, peek at response body for at most 1024 bytes
	str = buffer.slice(0, 1024).toString();

	// html5
	if (!res && str) {
		res = /<meta.+?charset=(['"])(.+?)\1/i.exec(str);
	}

	// html4
	if (!res && str) {
		res = /<meta[\s]+?http-equiv=(['"])content-type\1[\s]+?content=(['"])(.+?)\2/i.exec(str);
		if (!res) {
			res = /<meta[\s]+?content=(['"])(.+?)\1[\s]+?http-equiv=(['"])content-type\3/i.exec(str);
			if (res) {
				res.pop(); // drop last quote
			}
		}

		if (res) {
			res = /charset=(.*)/i.exec(res.pop());
		}
	}

	// xml
	if (!res && str) {
		res = /<\?xml.+?encoding=(['"])(.+?)\1/i.exec(str);
	}

	// found charset
	if (res) {
		charset = res.pop();

		// prevent decode issues when sites use incorrect encoding
		// ref: https://hsivonen.fi/encoding-menu/
		if (charset === 'gb2312' || charset === 'gbk') {
			charset = 'gb18030';
		}
	}

	// turn raw buffers into a single utf-8 buffer
	return convert(buffer, 'UTF-8', charset).toString();
}

/**
 * Detect a URLSearchParams object
 * ref: https://github.com/bitinn/node-fetch/issues/296#issuecomment-307598143
 *
 * @param   Object  obj     Object to detect by type or brand
 * @return  String
 */
function isURLSearchParams(obj) {
	// Duck-typing as a necessary condition.
	if (typeof obj !== 'object' || typeof obj.append !== 'function' || typeof obj.delete !== 'function' || typeof obj.get !== 'function' || typeof obj.getAll !== 'function' || typeof obj.has !== 'function' || typeof obj.set !== 'function') {
		return false;
	}

	// Brand-checking and more duck-typing as optional condition.
	return obj.constructor.name === 'URLSearchParams' || Object.prototype.toString.call(obj) === '[object URLSearchParams]' || typeof obj.sort === 'function';
}

/**
 * Check if `obj` is a W3C `Blob` object (which `File` inherits from)
 * @param  {*} obj
 * @return {boolean}
 */
function isBlob(obj) {
	return typeof obj === 'object' && typeof obj.arrayBuffer === 'function' && typeof obj.type === 'string' && typeof obj.stream === 'function' && typeof obj.constructor === 'function' && typeof obj.constructor.name === 'string' && /^(Blob|File)$/.test(obj.constructor.name) && /^(Blob|File)$/.test(obj[Symbol.toStringTag]);
}

/**
 * Clone body given Res/Req instance
 *
 * @param   Mixed  instance  Response or Request instance
 * @return  Mixed
 */
function clone(instance) {
	let p1, p2;
	let body = instance.body;

	// don't allow cloning a used body
	if (instance.bodyUsed) {
		throw new Error('cannot clone body after it is used');
	}

	// check that body is a stream and not form-data object
	// note: we can't clone the form-data object without having it as a dependency
	if (body instanceof Stream__default['default'] && typeof body.getBoundary !== 'function') {
		// tee instance body
		p1 = new PassThrough();
		p2 = new PassThrough();
		body.pipe(p1);
		body.pipe(p2);
		// set instance body to teed body and return the other teed body
		instance[INTERNALS].body = p1;
		body = p2;
	}

	return body;
}

/**
 * Performs the operation "extract a `Content-Type` value from |object|" as
 * specified in the specification:
 * https://fetch.spec.whatwg.org/#concept-bodyinit-extract
 *
 * This function assumes that instance.body is present.
 *
 * @param   Mixed  instance  Any options.body input
 */
function extractContentType(body) {
	if (body === null) {
		// body is null
		return null;
	} else if (typeof body === 'string') {
		// body is string
		return 'text/plain;charset=UTF-8';
	} else if (isURLSearchParams(body)) {
		// body is a URLSearchParams
		return 'application/x-www-form-urlencoded;charset=UTF-8';
	} else if (isBlob(body)) {
		// body is blob
		return body.type || null;
	} else if (Buffer.isBuffer(body)) {
		// body is buffer
		return null;
	} else if (Object.prototype.toString.call(body) === '[object ArrayBuffer]') {
		// body is ArrayBuffer
		return null;
	} else if (ArrayBuffer.isView(body)) {
		// body is ArrayBufferView
		return null;
	} else if (typeof body.getBoundary === 'function') {
		// detect form data input from form-data module
		return `multipart/form-data;boundary=${body.getBoundary()}`;
	} else if (body instanceof Stream__default['default']) {
		// body is stream
		// can't really do much about this
		return null;
	} else {
		// Body constructor defaults other things to string
		return 'text/plain;charset=UTF-8';
	}
}

/**
 * The Fetch Standard treats this as if "total bytes" is a property on the body.
 * For us, we have to explicitly get it with a function.
 *
 * ref: https://fetch.spec.whatwg.org/#concept-body-total-bytes
 *
 * @param   Body    instance   Instance of Body
 * @return  Number?            Number of bytes, or null if not possible
 */
function getTotalBytes(instance) {
	const body = instance.body;


	if (body === null) {
		// body is null
		return 0;
	} else if (isBlob(body)) {
		return body.size;
	} else if (Buffer.isBuffer(body)) {
		// body is buffer
		return body.length;
	} else if (body && typeof body.getLengthSync === 'function') {
		// detect form data input from form-data module
		if (body._lengthRetrievers && body._lengthRetrievers.length == 0 || // 1.x
		body.hasKnownLength && body.hasKnownLength()) {
			// 2.x
			return body.getLengthSync();
		}
		return null;
	} else {
		// body is stream
		return null;
	}
}

/**
 * Write a Body to a Node.js WritableStream (e.g. http.Request) object.
 *
 * @param   Body    instance   Instance of Body
 * @return  Void
 */
function writeToStream(dest, instance) {
	const body = instance.body;


	if (body === null) {
		// body is null
		dest.end();
	} else if (isBlob(body)) {
		body.stream().pipe(dest);
	} else if (Buffer.isBuffer(body)) {
		// body is buffer
		dest.write(body);
		dest.end();
	} else {
		// body is stream
		body.pipe(dest);
	}
}

// expose Promise
Body.Promise = global.Promise;

/**
 * headers.js
 *
 * Headers class offers convenient helpers
 */

const invalidTokenRegex = /[^\^_`a-zA-Z\-0-9!#$%&'*+.|~]/;
const invalidHeaderCharRegex = /[^\t\x20-\x7e\x80-\xff]/;

function validateName(name) {
	name = `${name}`;
	if (invalidTokenRegex.test(name) || name === '') {
		throw new TypeError(`${name} is not a legal HTTP header name`);
	}
}

function validateValue(value) {
	value = `${value}`;
	if (invalidHeaderCharRegex.test(value)) {
		throw new TypeError(`${value} is not a legal HTTP header value`);
	}
}

/**
 * Find the key in the map object given a header name.
 *
 * Returns undefined if not found.
 *
 * @param   String  name  Header name
 * @return  String|Undefined
 */
function find(map, name) {
	name = name.toLowerCase();
	for (const key in map) {
		if (key.toLowerCase() === name) {
			return key;
		}
	}
	return undefined;
}

const MAP = Symbol('map');
class Headers {
	/**
  * Headers class
  *
  * @param   Object  headers  Response headers
  * @return  Void
  */
	constructor() {
		let init = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;

		this[MAP] = Object.create(null);

		if (init instanceof Headers) {
			const rawHeaders = init.raw();
			const headerNames = Object.keys(rawHeaders);

			for (const headerName of headerNames) {
				for (const value of rawHeaders[headerName]) {
					this.append(headerName, value);
				}
			}

			return;
		}

		// We don't worry about converting prop to ByteString here as append()
		// will handle it.
		if (init == null) ; else if (typeof init === 'object') {
			const method = init[Symbol.iterator];
			if (method != null) {
				if (typeof method !== 'function') {
					throw new TypeError('Header pairs must be iterable');
				}

				// sequence<sequence<ByteString>>
				// Note: per spec we have to first exhaust the lists then process them
				const pairs = [];
				for (const pair of init) {
					if (typeof pair !== 'object' || typeof pair[Symbol.iterator] !== 'function') {
						throw new TypeError('Each header pair must be iterable');
					}
					pairs.push(Array.from(pair));
				}

				for (const pair of pairs) {
					if (pair.length !== 2) {
						throw new TypeError('Each header pair must be a name/value tuple');
					}
					this.append(pair[0], pair[1]);
				}
			} else {
				// record<ByteString, ByteString>
				for (const key of Object.keys(init)) {
					const value = init[key];
					this.append(key, value);
				}
			}
		} else {
			throw new TypeError('Provided initializer must be an object');
		}
	}

	/**
  * Return combined header value given name
  *
  * @param   String  name  Header name
  * @return  Mixed
  */
	get(name) {
		name = `${name}`;
		validateName(name);
		const key = find(this[MAP], name);
		if (key === undefined) {
			return null;
		}

		return this[MAP][key].join(', ');
	}

	/**
  * Iterate over all headers
  *
  * @param   Function  callback  Executed for each item with parameters (value, name, thisArg)
  * @param   Boolean   thisArg   `this` context for callback function
  * @return  Void
  */
	forEach(callback) {
		let thisArg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

		let pairs = getHeaders(this);
		let i = 0;
		while (i < pairs.length) {
			var _pairs$i = pairs[i];
			const name = _pairs$i[0],
			      value = _pairs$i[1];

			callback.call(thisArg, value, name, this);
			pairs = getHeaders(this);
			i++;
		}
	}

	/**
  * Overwrite header values given name
  *
  * @param   String  name   Header name
  * @param   String  value  Header value
  * @return  Void
  */
	set(name, value) {
		name = `${name}`;
		value = `${value}`;
		validateName(name);
		validateValue(value);
		const key = find(this[MAP], name);
		this[MAP][key !== undefined ? key : name] = [value];
	}

	/**
  * Append a value onto existing header
  *
  * @param   String  name   Header name
  * @param   String  value  Header value
  * @return  Void
  */
	append(name, value) {
		name = `${name}`;
		value = `${value}`;
		validateName(name);
		validateValue(value);
		const key = find(this[MAP], name);
		if (key !== undefined) {
			this[MAP][key].push(value);
		} else {
			this[MAP][name] = [value];
		}
	}

	/**
  * Check for header name existence
  *
  * @param   String   name  Header name
  * @return  Boolean
  */
	has(name) {
		name = `${name}`;
		validateName(name);
		return find(this[MAP], name) !== undefined;
	}

	/**
  * Delete all header values given name
  *
  * @param   String  name  Header name
  * @return  Void
  */
	delete(name) {
		name = `${name}`;
		validateName(name);
		const key = find(this[MAP], name);
		if (key !== undefined) {
			delete this[MAP][key];
		}
	}

	/**
  * Return raw headers (non-spec api)
  *
  * @return  Object
  */
	raw() {
		return this[MAP];
	}

	/**
  * Get an iterator on keys.
  *
  * @return  Iterator
  */
	keys() {
		return createHeadersIterator(this, 'key');
	}

	/**
  * Get an iterator on values.
  *
  * @return  Iterator
  */
	values() {
		return createHeadersIterator(this, 'value');
	}

	/**
  * Get an iterator on entries.
  *
  * This is the default iterator of the Headers object.
  *
  * @return  Iterator
  */
	[Symbol.iterator]() {
		return createHeadersIterator(this, 'key+value');
	}
}
Headers.prototype.entries = Headers.prototype[Symbol.iterator];

Object.defineProperty(Headers.prototype, Symbol.toStringTag, {
	value: 'Headers',
	writable: false,
	enumerable: false,
	configurable: true
});

Object.defineProperties(Headers.prototype, {
	get: { enumerable: true },
	forEach: { enumerable: true },
	set: { enumerable: true },
	append: { enumerable: true },
	has: { enumerable: true },
	delete: { enumerable: true },
	keys: { enumerable: true },
	values: { enumerable: true },
	entries: { enumerable: true }
});

function getHeaders(headers) {
	let kind = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'key+value';

	const keys = Object.keys(headers[MAP]).sort();
	return keys.map(kind === 'key' ? function (k) {
		return k.toLowerCase();
	} : kind === 'value' ? function (k) {
		return headers[MAP][k].join(', ');
	} : function (k) {
		return [k.toLowerCase(), headers[MAP][k].join(', ')];
	});
}

const INTERNAL = Symbol('internal');

function createHeadersIterator(target, kind) {
	const iterator = Object.create(HeadersIteratorPrototype);
	iterator[INTERNAL] = {
		target,
		kind,
		index: 0
	};
	return iterator;
}

const HeadersIteratorPrototype = Object.setPrototypeOf({
	next() {
		// istanbul ignore if
		if (!this || Object.getPrototypeOf(this) !== HeadersIteratorPrototype) {
			throw new TypeError('Value of `this` is not a HeadersIterator');
		}

		var _INTERNAL = this[INTERNAL];
		const target = _INTERNAL.target,
		      kind = _INTERNAL.kind,
		      index = _INTERNAL.index;

		const values = getHeaders(target, kind);
		const len = values.length;
		if (index >= len) {
			return {
				value: undefined,
				done: true
			};
		}

		this[INTERNAL].index = index + 1;

		return {
			value: values[index],
			done: false
		};
	}
}, Object.getPrototypeOf(Object.getPrototypeOf([][Symbol.iterator]())));

Object.defineProperty(HeadersIteratorPrototype, Symbol.toStringTag, {
	value: 'HeadersIterator',
	writable: false,
	enumerable: false,
	configurable: true
});

/**
 * Export the Headers object in a form that Node.js can consume.
 *
 * @param   Headers  headers
 * @return  Object
 */
function exportNodeCompatibleHeaders(headers) {
	const obj = Object.assign({ __proto__: null }, headers[MAP]);

	// http.request() only supports string as Host header. This hack makes
	// specifying custom Host header possible.
	const hostHeaderKey = find(headers[MAP], 'Host');
	if (hostHeaderKey !== undefined) {
		obj[hostHeaderKey] = obj[hostHeaderKey][0];
	}

	return obj;
}

/**
 * Create a Headers object from an object of headers, ignoring those that do
 * not conform to HTTP grammar productions.
 *
 * @param   Object  obj  Object of headers
 * @return  Headers
 */
function createHeadersLenient(obj) {
	const headers = new Headers();
	for (const name of Object.keys(obj)) {
		if (invalidTokenRegex.test(name)) {
			continue;
		}
		if (Array.isArray(obj[name])) {
			for (const val of obj[name]) {
				if (invalidHeaderCharRegex.test(val)) {
					continue;
				}
				if (headers[MAP][name] === undefined) {
					headers[MAP][name] = [val];
				} else {
					headers[MAP][name].push(val);
				}
			}
		} else if (!invalidHeaderCharRegex.test(obj[name])) {
			headers[MAP][name] = [obj[name]];
		}
	}
	return headers;
}

const INTERNALS$1 = Symbol('Response internals');

// fix an issue where "STATUS_CODES" aren't a named export for node <10
const STATUS_CODES = http__default['default'].STATUS_CODES;

/**
 * Response class
 *
 * @param   Stream  body  Readable stream
 * @param   Object  opts  Response options
 * @return  Void
 */
class Response {
	constructor() {
		let body = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
		let opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

		Body.call(this, body, opts);

		const status = opts.status || 200;
		const headers = new Headers(opts.headers);

		if (body != null && !headers.has('Content-Type')) {
			const contentType = extractContentType(body);
			if (contentType) {
				headers.append('Content-Type', contentType);
			}
		}

		this[INTERNALS$1] = {
			url: opts.url,
			status,
			statusText: opts.statusText || STATUS_CODES[status],
			headers,
			counter: opts.counter
		};
	}

	get url() {
		return this[INTERNALS$1].url || '';
	}

	get status() {
		return this[INTERNALS$1].status;
	}

	/**
  * Convenience property representing if the request ended normally
  */
	get ok() {
		return this[INTERNALS$1].status >= 200 && this[INTERNALS$1].status < 300;
	}

	get redirected() {
		return this[INTERNALS$1].counter > 0;
	}

	get statusText() {
		return this[INTERNALS$1].statusText;
	}

	get headers() {
		return this[INTERNALS$1].headers;
	}

	/**
  * Clone this response
  *
  * @return  Response
  */
	clone() {
		return new Response(clone(this), {
			url: this.url,
			status: this.status,
			statusText: this.statusText,
			headers: this.headers,
			ok: this.ok,
			redirected: this.redirected
		});
	}
}

Body.mixIn(Response.prototype);

Object.defineProperties(Response.prototype, {
	url: { enumerable: true },
	status: { enumerable: true },
	ok: { enumerable: true },
	redirected: { enumerable: true },
	statusText: { enumerable: true },
	headers: { enumerable: true },
	clone: { enumerable: true }
});

Object.defineProperty(Response.prototype, Symbol.toStringTag, {
	value: 'Response',
	writable: false,
	enumerable: false,
	configurable: true
});

const INTERNALS$2 = Symbol('Request internals');

// fix an issue where "format", "parse" aren't a named export for node <10
const parse_url = Url__default['default'].parse;
const format_url = Url__default['default'].format;

const streamDestructionSupported = 'destroy' in Stream__default['default'].Readable.prototype;

/**
 * Check if a value is an instance of Request.
 *
 * @param   Mixed   input
 * @return  Boolean
 */
function isRequest(input) {
	return typeof input === 'object' && typeof input[INTERNALS$2] === 'object';
}

function isAbortSignal(signal) {
	const proto = signal && typeof signal === 'object' && Object.getPrototypeOf(signal);
	return !!(proto && proto.constructor.name === 'AbortSignal');
}

/**
 * Request class
 *
 * @param   Mixed   input  Url or Request instance
 * @param   Object  init   Custom options
 * @return  Void
 */
class Request {
	constructor(input) {
		let init = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

		let parsedURL;

		// normalize input
		if (!isRequest(input)) {
			if (input && input.href) {
				// in order to support Node.js' Url objects; though WHATWG's URL objects
				// will fall into this branch also (since their `toString()` will return
				// `href` property anyway)
				parsedURL = parse_url(input.href);
			} else {
				// coerce input to a string before attempting to parse
				parsedURL = parse_url(`${input}`);
			}
			input = {};
		} else {
			parsedURL = parse_url(input.url);
		}

		let method = init.method || input.method || 'GET';
		method = method.toUpperCase();

		if ((init.body != null || isRequest(input) && input.body !== null) && (method === 'GET' || method === 'HEAD')) {
			throw new TypeError('Request with GET/HEAD method cannot have body');
		}

		let inputBody = init.body != null ? init.body : isRequest(input) && input.body !== null ? clone(input) : null;

		Body.call(this, inputBody, {
			timeout: init.timeout || input.timeout || 0,
			size: init.size || input.size || 0
		});

		const headers = new Headers(init.headers || input.headers || {});

		if (inputBody != null && !headers.has('Content-Type')) {
			const contentType = extractContentType(inputBody);
			if (contentType) {
				headers.append('Content-Type', contentType);
			}
		}

		let signal = isRequest(input) ? input.signal : null;
		if ('signal' in init) signal = init.signal;

		if (signal != null && !isAbortSignal(signal)) {
			throw new TypeError('Expected signal to be an instanceof AbortSignal');
		}

		this[INTERNALS$2] = {
			method,
			redirect: init.redirect || input.redirect || 'follow',
			headers,
			parsedURL,
			signal
		};

		// node-fetch-only options
		this.follow = init.follow !== undefined ? init.follow : input.follow !== undefined ? input.follow : 20;
		this.compress = init.compress !== undefined ? init.compress : input.compress !== undefined ? input.compress : true;
		this.counter = init.counter || input.counter || 0;
		this.agent = init.agent || input.agent;
	}

	get method() {
		return this[INTERNALS$2].method;
	}

	get url() {
		return format_url(this[INTERNALS$2].parsedURL);
	}

	get headers() {
		return this[INTERNALS$2].headers;
	}

	get redirect() {
		return this[INTERNALS$2].redirect;
	}

	get signal() {
		return this[INTERNALS$2].signal;
	}

	/**
  * Clone this request
  *
  * @return  Request
  */
	clone() {
		return new Request(this);
	}
}

Body.mixIn(Request.prototype);

Object.defineProperty(Request.prototype, Symbol.toStringTag, {
	value: 'Request',
	writable: false,
	enumerable: false,
	configurable: true
});

Object.defineProperties(Request.prototype, {
	method: { enumerable: true },
	url: { enumerable: true },
	headers: { enumerable: true },
	redirect: { enumerable: true },
	clone: { enumerable: true },
	signal: { enumerable: true }
});

/**
 * Convert a Request to Node.js http request options.
 *
 * @param   Request  A Request instance
 * @return  Object   The options object to be passed to http.request
 */
function getNodeRequestOptions(request) {
	const parsedURL = request[INTERNALS$2].parsedURL;
	const headers = new Headers(request[INTERNALS$2].headers);

	// fetch step 1.3
	if (!headers.has('Accept')) {
		headers.set('Accept', '*/*');
	}

	// Basic fetch
	if (!parsedURL.protocol || !parsedURL.hostname) {
		throw new TypeError('Only absolute URLs are supported');
	}

	if (!/^https?:$/.test(parsedURL.protocol)) {
		throw new TypeError('Only HTTP(S) protocols are supported');
	}

	if (request.signal && request.body instanceof Stream__default['default'].Readable && !streamDestructionSupported) {
		throw new Error('Cancellation of streamed requests with AbortSignal is not supported in node < 8');
	}

	// HTTP-network-or-cache fetch steps 2.4-2.7
	let contentLengthValue = null;
	if (request.body == null && /^(POST|PUT)$/i.test(request.method)) {
		contentLengthValue = '0';
	}
	if (request.body != null) {
		const totalBytes = getTotalBytes(request);
		if (typeof totalBytes === 'number') {
			contentLengthValue = String(totalBytes);
		}
	}
	if (contentLengthValue) {
		headers.set('Content-Length', contentLengthValue);
	}

	// HTTP-network-or-cache fetch step 2.11
	if (!headers.has('User-Agent')) {
		headers.set('User-Agent', 'node-fetch/1.0 (+https://github.com/bitinn/node-fetch)');
	}

	// HTTP-network-or-cache fetch step 2.15
	if (request.compress && !headers.has('Accept-Encoding')) {
		headers.set('Accept-Encoding', 'gzip,deflate');
	}

	let agent = request.agent;
	if (typeof agent === 'function') {
		agent = agent(parsedURL);
	}

	if (!headers.has('Connection') && !agent) {
		headers.set('Connection', 'close');
	}

	// HTTP-network fetch step 4.2
	// chunked encoding is handled by Node.js

	return Object.assign({}, parsedURL, {
		method: request.method,
		headers: exportNodeCompatibleHeaders(headers),
		agent
	});
}

/**
 * abort-error.js
 *
 * AbortError interface for cancelled requests
 */

/**
 * Create AbortError instance
 *
 * @param   String      message      Error message for human
 * @return  AbortError
 */
function AbortError(message) {
  Error.call(this, message);

  this.type = 'aborted';
  this.message = message;

  // hide custom error implementation details from end-users
  Error.captureStackTrace(this, this.constructor);
}

AbortError.prototype = Object.create(Error.prototype);
AbortError.prototype.constructor = AbortError;
AbortError.prototype.name = 'AbortError';

// fix an issue where "PassThrough", "resolve" aren't a named export for node <10
const PassThrough$1 = Stream__default['default'].PassThrough;
const resolve_url = Url__default['default'].resolve;

/**
 * Fetch function
 *
 * @param   Mixed    url   Absolute url or Request instance
 * @param   Object   opts  Fetch options
 * @return  Promise
 */
function fetch(url, opts) {

	// allow custom promise
	if (!fetch.Promise) {
		throw new Error('native promise missing, set fetch.Promise to your favorite alternative');
	}

	Body.Promise = fetch.Promise;

	// wrap http.request into fetch
	return new fetch.Promise(function (resolve, reject) {
		// build request object
		const request = new Request(url, opts);
		const options = getNodeRequestOptions(request);

		const send = (options.protocol === 'https:' ? https__default['default'] : http__default['default']).request;
		const signal = request.signal;

		let response = null;

		const abort = function abort() {
			let error = new AbortError('The user aborted a request.');
			reject(error);
			if (request.body && request.body instanceof Stream__default['default'].Readable) {
				request.body.destroy(error);
			}
			if (!response || !response.body) return;
			response.body.emit('error', error);
		};

		if (signal && signal.aborted) {
			abort();
			return;
		}

		const abortAndFinalize = function abortAndFinalize() {
			abort();
			finalize();
		};

		// send request
		const req = send(options);
		let reqTimeout;

		if (signal) {
			signal.addEventListener('abort', abortAndFinalize);
		}

		function finalize() {
			req.abort();
			if (signal) signal.removeEventListener('abort', abortAndFinalize);
			clearTimeout(reqTimeout);
		}

		if (request.timeout) {
			req.once('socket', function (socket) {
				reqTimeout = setTimeout(function () {
					reject(new FetchError(`network timeout at: ${request.url}`, 'request-timeout'));
					finalize();
				}, request.timeout);
			});
		}

		req.on('error', function (err) {
			reject(new FetchError(`request to ${request.url} failed, reason: ${err.message}`, 'system', err));
			finalize();
		});

		req.on('response', function (res) {
			clearTimeout(reqTimeout);

			const headers = createHeadersLenient(res.headers);

			// HTTP fetch step 5
			if (fetch.isRedirect(res.statusCode)) {
				// HTTP fetch step 5.2
				const location = headers.get('Location');

				// HTTP fetch step 5.3
				const locationURL = location === null ? null : resolve_url(request.url, location);

				// HTTP fetch step 5.5
				switch (request.redirect) {
					case 'error':
						reject(new FetchError(`uri requested responds with a redirect, redirect mode is set to error: ${request.url}`, 'no-redirect'));
						finalize();
						return;
					case 'manual':
						// node-fetch-specific step: make manual redirect a bit easier to use by setting the Location header value to the resolved URL.
						if (locationURL !== null) {
							// handle corrupted header
							try {
								headers.set('Location', locationURL);
							} catch (err) {
								// istanbul ignore next: nodejs server prevent invalid response headers, we can't test this through normal request
								reject(err);
							}
						}
						break;
					case 'follow':
						// HTTP-redirect fetch step 2
						if (locationURL === null) {
							break;
						}

						// HTTP-redirect fetch step 5
						if (request.counter >= request.follow) {
							reject(new FetchError(`maximum redirect reached at: ${request.url}`, 'max-redirect'));
							finalize();
							return;
						}

						// HTTP-redirect fetch step 6 (counter increment)
						// Create a new Request object.
						const requestOpts = {
							headers: new Headers(request.headers),
							follow: request.follow,
							counter: request.counter + 1,
							agent: request.agent,
							compress: request.compress,
							method: request.method,
							body: request.body,
							signal: request.signal,
							timeout: request.timeout,
							size: request.size
						};

						// HTTP-redirect fetch step 9
						if (res.statusCode !== 303 && request.body && getTotalBytes(request) === null) {
							reject(new FetchError('Cannot follow redirect with body being a readable stream', 'unsupported-redirect'));
							finalize();
							return;
						}

						// HTTP-redirect fetch step 11
						if (res.statusCode === 303 || (res.statusCode === 301 || res.statusCode === 302) && request.method === 'POST') {
							requestOpts.method = 'GET';
							requestOpts.body = undefined;
							requestOpts.headers.delete('content-length');
						}

						// HTTP-redirect fetch step 15
						resolve(fetch(new Request(locationURL, requestOpts)));
						finalize();
						return;
				}
			}

			// prepare response
			res.once('end', function () {
				if (signal) signal.removeEventListener('abort', abortAndFinalize);
			});
			let body = res.pipe(new PassThrough$1());

			const response_options = {
				url: request.url,
				status: res.statusCode,
				statusText: res.statusMessage,
				headers: headers,
				size: request.size,
				timeout: request.timeout,
				counter: request.counter
			};

			// HTTP-network fetch step 12.1.1.3
			const codings = headers.get('Content-Encoding');

			// HTTP-network fetch step 12.1.1.4: handle content codings

			// in following scenarios we ignore compression support
			// 1. compression support is disabled
			// 2. HEAD request
			// 3. no Content-Encoding header
			// 4. no content response (204)
			// 5. content not modified response (304)
			if (!request.compress || request.method === 'HEAD' || codings === null || res.statusCode === 204 || res.statusCode === 304) {
				response = new Response(body, response_options);
				resolve(response);
				return;
			}

			// For Node v6+
			// Be less strict when decoding compressed responses, since sometimes
			// servers send slightly invalid responses that are still accepted
			// by common browsers.
			// Always using Z_SYNC_FLUSH is what cURL does.
			const zlibOptions = {
				flush: zlib__default['default'].Z_SYNC_FLUSH,
				finishFlush: zlib__default['default'].Z_SYNC_FLUSH
			};

			// for gzip
			if (codings == 'gzip' || codings == 'x-gzip') {
				body = body.pipe(zlib__default['default'].createGunzip(zlibOptions));
				response = new Response(body, response_options);
				resolve(response);
				return;
			}

			// for deflate
			if (codings == 'deflate' || codings == 'x-deflate') {
				// handle the infamous raw deflate response from old servers
				// a hack for old IIS and Apache servers
				const raw = res.pipe(new PassThrough$1());
				raw.once('data', function (chunk) {
					// see http://stackoverflow.com/questions/37519828
					if ((chunk[0] & 0x0F) === 0x08) {
						body = body.pipe(zlib__default['default'].createInflate());
					} else {
						body = body.pipe(zlib__default['default'].createInflateRaw());
					}
					response = new Response(body, response_options);
					resolve(response);
				});
				return;
			}

			// for br
			if (codings == 'br' && typeof zlib__default['default'].createBrotliDecompress === 'function') {
				body = body.pipe(zlib__default['default'].createBrotliDecompress());
				response = new Response(body, response_options);
				resolve(response);
				return;
			}

			// otherwise, use response as-is
			response = new Response(body, response_options);
			resolve(response);
		});

		writeToStream(req, request);
	});
}
/**
 * Redirect code matching
 *
 * @param   Number   code  Status code
 * @return  Boolean
 */
fetch.isRedirect = function (code) {
	return code === 301 || code === 302 || code === 303 || code === 307 || code === 308;
};

// expose Promise
fetch.Promise = global.Promise;

var lib = /*#__PURE__*/Object.freeze({
	__proto__: null,
	'default': fetch,
	Headers: Headers,
	Request: Request,
	Response: Response,
	FetchError: FetchError
});

var node_fetch_1 = /*@__PURE__*/getAugmentedNamespace(lib);

var net = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.download = exports.fetchRelease = void 0;









const pipeline = util_1__default['default'].promisify(Stream__default['default'].pipeline);
const GITHUB_API_ENDPOINT_URL = "https://api.github.com";
const OWNER = "rust-analyzer";
const REPO = "rust-analyzer";
async function fetchRelease(releaseTag, githubToken) {
    const apiEndpointPath = `/repos/${OWNER}/${REPO}/releases/tags/${releaseTag}`;
    const requestUrl = GITHUB_API_ENDPOINT_URL + apiEndpointPath;
    util.log.debug("Issuing request for released artifacts metadata to", requestUrl);
    const headers = { Accept: "application/vnd.github.v3+json" };
    if (githubToken != null) {
        headers.Authorization = "token " + githubToken;
    }
    const response = await node_fetch_1.default(requestUrl, { headers: headers });
    if (!response.ok) {
        util.log.error("Error fetching artifact release info", {
            requestUrl,
            releaseTag,
            response: {
                headers: response.headers,
                status: response.status,
                body: await response.text(),
            }
        });
        throw new Error(`Got response ${response.status} when trying to fetch ` +
            `release info for ${releaseTag} release`);
    }
    // We skip runtime type checks for simplicity (here we cast from `any` to `GithubRelease`)
    const release = await response.json();
    return release;
}
exports.fetchRelease = fetchRelease;
async function download(opts) {
    // Put artifact into a temporary file (in the same dir for simplicity)
    // to prevent partially downloaded files when user kills vscode
    const dest = path__default['default'].parse(opts.dest);
    const randomHex = crypto_1__default['default'].randomBytes(5).toString("hex");
    const tempFile = path__default['default'].join(dest.dir, `${dest.name}${randomHex}`);
    if (opts.overwrite) {
        // Unlinking the exe file before moving new one on its place should prevent ETXTBSY error.
        await fs__default['default'].promises.unlink(opts.dest).catch(err => {
            if (err.code !== "ENOENT")
                throw err;
        });
    }
    await vscode__default['default'].window.withProgress({
        location: vscode__default['default'].ProgressLocation.Notification,
        cancellable: false,
        title: opts.progressTitle
    }, async (progress, _cancellationToken) => {
        let lastPercentage = 0;
        await downloadFile(opts.url, tempFile, opts.mode, !!opts.gunzip, (readBytes, totalBytes) => {
            const newPercentage = (readBytes / totalBytes) * 100;
            progress.report({
                message: newPercentage.toFixed(0) + "%",
                increment: newPercentage - lastPercentage
            });
            lastPercentage = newPercentage;
        });
    });
    await fs__default['default'].promises.rename(tempFile, opts.dest);
}
exports.download = download;
async function downloadFile(url, destFilePath, mode, gunzip, onProgress) {
    const res = await node_fetch_1.default(url);
    if (!res.ok) {
        util.log.error("Error", res.status, "while downloading file from", url);
        util.log.error({ body: await res.text(), headers: res.headers });
        throw new Error(`Got response ${res.status} when trying to download a file.`);
    }
    const totalBytes = Number(res.headers.get('content-length'));
    util.assert(!Number.isNaN(totalBytes), "Sanity check of content-length protocol");
    util.log.debug("Downloading file of", totalBytes, "bytes size from", url, "to", destFilePath);
    let readBytes = 0;
    res.body.on("data", (chunk) => {
        readBytes += chunk.length;
        onProgress(readBytes, totalBytes);
    });
    const destFileStream = fs__default['default'].createWriteStream(destFilePath, { mode });
    const srcStream = gunzip ? res.body.pipe(zlib__default['default'].createGunzip()) : res.body;
    await pipeline(srcStream, destFileStream);
    // Don't apply the workaround in fixed versions of nodejs, since the process
    // freezes on them, the process waits for no-longer emitted `close` event.
    // The fix was applied in commit 7eed9d6bcc in v13.11.0
    // See the nodejs changelog:
    // https://github.com/nodejs/node/blob/master/doc/changelogs/CHANGELOG_V13.md
    const [, major, minor] = /v(\d+)\.(\d+)\.(\d+)/.exec(process.version);
    if (+major > 13 || (+major === 13 && +minor >= 11))
        return;
    await new Promise(resolve => {
        destFileStream.on("close", resolve);
        destFileStream.destroy();
        // This workaround is awaiting to be removed when vscode moves to newer nodejs version:
        // https://github.com/rust-analyzer/rust-analyzer/issues/3167
    });
}

});

var main$4 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;












const util_2 = util;

let ctx$1;
const RUST_PROJECT_CONTEXT_NAME = "inRustProject";
async function activate(context) {
    // VS Code doesn't show a notification when an extension fails to activate
    // so we do it ourselves.
    await tryActivate(context).catch(err => {
        void vscode__default['default'].window.showErrorMessage(`Cannot activate rust-analyzer: ${err.message}`);
        throw err;
    });
}
exports.activate = activate;
async function tryActivate(context) {
    var _a;
    // Register a "dumb" onEnter command for the case where server fails to
    // start.
    //
    // FIXME: refactor command registration code such that commands are
    // **always** registered, even if the server does not start. Use API like
    // this perhaps?
    //
    // ```TypeScript
    // registerCommand(
    //    factory: (Ctx) => ((Ctx) => any),
    //    fallback: () => any = () => vscode.window.showErrorMessage(
    //        "rust-analyzer is not available"
    //    ),
    // )
    const defaultOnEnter = vscode__default['default'].commands.registerCommand('rust-analyzer.onEnter', () => vscode__default['default'].commands.executeCommand('default:type', { text: '\n' }));
    context.subscriptions.push(defaultOnEnter);
    const config$1 = new config.Config(context);
    const state = new persistent_state.PersistentState(context.globalState);
    const serverPath = await bootstrap(config$1, state).catch(err => {
        let message = "bootstrap error. ";
        if (err.code === "EBUSY" || err.code === "ETXTBSY" || err.code === "EPERM") {
            message += "Other vscode windows might be using rust-analyzer, ";
            message += "you should close them and reload this window to retry. ";
        }
        message += 'See the logs in "OUTPUT > Rust Analyzer Client" (should open automatically). ';
        message += 'To enable verbose logs use { "rust-analyzer.trace.extension": true }';
        util.log.error("Bootstrap error", err);
        throw new Error(message);
    });
    const workspaceFolder = (_a = vscode__default['default'].workspace.workspaceFolders) === null || _a === void 0 ? void 0 : _a[0];
    if (workspaceFolder === undefined) {
        throw new Error("no folder is opened");
    }
    // Note: we try to start the server before we activate type hints so that it
    // registers its `onDidChangeDocument` handler before us.
    //
    // This a horribly, horribly wrong way to deal with this problem.
    ctx$1 = await ctx.Ctx.create(config$1, context, serverPath, workspaceFolder.uri.fsPath);
    util_2.setContextValue(RUST_PROJECT_CONTEXT_NAME, true);
    // Commands which invokes manually via command palette, shortcut, etc.
    // Reloading is inspired by @DanTup maneuver: https://github.com/microsoft/vscode/issues/45774#issuecomment-373423895
    ctx$1.registerCommand('reload', _ => async () => {
        void vscode__default['default'].window.showInformationMessage('Reloading rust-analyzer...');
        await deactivate();
        while (context.subscriptions.length > 0) {
            try {
                context.subscriptions.pop().dispose();
            }
            catch (err) {
                util.log.error("Dispose error:", err);
            }
        }
        await activate(context).catch(util.log.error);
    });
    ctx$1.registerCommand('updateGithubToken', ctx => async () => {
        await queryForGithubToken(new persistent_state.PersistentState(ctx.globalState));
    });
    ctx$1.registerCommand('analyzerStatus', commands.analyzerStatus);
    ctx$1.registerCommand('memoryUsage', commands.memoryUsage);
    ctx$1.registerCommand('reloadWorkspace', commands.reloadWorkspace);
    ctx$1.registerCommand('matchingBrace', commands.matchingBrace);
    ctx$1.registerCommand('joinLines', commands.joinLines);
    ctx$1.registerCommand('parentModule', commands.parentModule);
    ctx$1.registerCommand('syntaxTree', commands.syntaxTree);
    ctx$1.registerCommand('viewHir', commands.viewHir);
    ctx$1.registerCommand('expandMacro', commands.expandMacro);
    ctx$1.registerCommand('run', commands.run);
    ctx$1.registerCommand('debug', commands.debug);
    ctx$1.registerCommand('newDebugConfig', commands.newDebugConfig);
    ctx$1.registerCommand('openDocs', commands.openDocs);
    ctx$1.registerCommand('openCargoToml', commands.openCargoToml);
    defaultOnEnter.dispose();
    ctx$1.registerCommand('onEnter', commands.onEnter);
    ctx$1.registerCommand('ssr', commands.ssr);
    ctx$1.registerCommand('serverVersion', commands.serverVersion);
    ctx$1.registerCommand('toggleInlayHints', commands.toggleInlayHints);
    // Internal commands which are invoked by the server.
    ctx$1.registerCommand('runSingle', commands.runSingle);
    ctx$1.registerCommand('debugSingle', commands.debugSingle);
    ctx$1.registerCommand('showReferences', commands.showReferences);
    ctx$1.registerCommand('applySnippetWorkspaceEdit', commands.applySnippetWorkspaceEditCommand);
    ctx$1.registerCommand('resolveCodeAction', commands.resolveCodeAction);
    ctx$1.registerCommand('applyActionGroup', commands.applyActionGroup);
    ctx$1.registerCommand('gotoLocation', commands.gotoLocation);
    ctx$1.pushCleanup(tasks.activateTaskProvider(workspaceFolder, ctx$1.config));
    inlay_hints.activateInlayHints(ctx$1);
    warnAboutExtensionConflicts();
    vscode__default['default'].workspace.onDidChangeConfiguration(_ => { var _a; return (_a = ctx$1 === null || ctx$1 === void 0 ? void 0 : ctx$1.client) === null || _a === void 0 ? void 0 : _a.sendNotification('workspace/didChangeConfiguration', { settings: "" }); }, null, ctx$1.subscriptions);
}
async function deactivate() {
    util_2.setContextValue(RUST_PROJECT_CONTEXT_NAME, undefined);
    await (ctx$1 === null || ctx$1 === void 0 ? void 0 : ctx$1.client.stop());
    ctx$1 = undefined;
}
exports.deactivate = deactivate;
async function bootstrap(config, state) {
    await fs__default['default'].promises.mkdir(config.globalStoragePath, { recursive: true });
    await bootstrapExtension(config, state);
    const path = await bootstrapServer(config, state);
    return path;
}
async function bootstrapExtension(config$1, state) {
    if (config$1.package.releaseTag === null)
        return;
    if (config$1.channel === "stable") {
        if (config$1.package.releaseTag === config.NIGHTLY_TAG) {
            void vscode__default['default'].window.showWarningMessage(`You are running a nightly version of rust-analyzer extension. ` +
                `To switch to stable, uninstall the extension and re-install it from the marketplace`);
        }
        return;
    }
    if (serverPath(config$1) !== null)
        return;
    const now = Date.now();
    if (config$1.package.releaseTag === config.NIGHTLY_TAG) {
        // Check if we should poll github api for the new nightly version
        // if we haven't done it during the past hour
        const lastCheck = state.lastCheck;
        const anHour = 60 * 60 * 1000;
        const shouldCheckForNewNightly = state.releaseId === undefined || (now - (lastCheck !== null && lastCheck !== void 0 ? lastCheck : 0)) > anHour;
        if (!shouldCheckForNewNightly)
            return;
    }
    const release = await downloadWithRetryDialog(state, async () => {
        return await net.fetchRelease("nightly", state.githubToken);
    }).catch((e) => {
        util.log.error(e);
        if (state.releaseId === undefined) { // Show error only for the initial download
            vscode__default['default'].window.showErrorMessage(`Failed to download rust-analyzer nightly ${e}`);
        }
        return undefined;
    });
    if (release === undefined || release.id === state.releaseId)
        return;
    const userResponse = await vscode__default['default'].window.showInformationMessage("New version of rust-analyzer (nightly) is available (requires reload).", "Update");
    if (userResponse !== "Update")
        return;
    const artifact = release.assets.find(artifact => artifact.name === "rust-analyzer.vsix");
    util.assert(!!artifact, `Bad release: ${JSON.stringify(release)}`);
    const dest = path__default['default'].join(config$1.globalStoragePath, "rust-analyzer.vsix");
    await downloadWithRetryDialog(state, async () => {
        await net.download({
            url: artifact.browser_download_url,
            dest,
            progressTitle: "Downloading rust-analyzer extension",
            overwrite: true,
        });
    });
    await vscode__default['default'].commands.executeCommand("workbench.extensions.installExtension", vscode__default['default'].Uri.file(dest));
    await fs__default['default'].promises.unlink(dest);
    await state.updateReleaseId(release.id);
    await state.updateLastCheck(now);
    await vscode__default['default'].commands.executeCommand("workbench.action.reloadWindow");
}
async function bootstrapServer(config, state) {
    const path = await getServer(config, state);
    if (!path) {
        throw new Error("Rust Analyzer Language Server is not available. " +
            "Please, ensure its [proper installation](https://rust-analyzer.github.io/manual.html#installation).");
    }
    util.log.info("Using server binary at", path);
    if (!util.isValidExecutable(path)) {
        throw new Error(`Failed to execute ${path} --version`);
    }
    return path;
}
async function patchelf(dest) {
    await vscode__default['default'].window.withProgress({
        location: vscode__default['default'].ProgressLocation.Notification,
        title: "Patching rust-analyzer for NixOS"
    }, async (progress, _) => {
        const expression = `
            {src, pkgs ? import <nixpkgs> {}}:
                pkgs.stdenv.mkDerivation {
                    name = "rust-analyzer";
                    inherit src;
                    phases = [ "installPhase" "fixupPhase" ];
                    installPhase = "cp $src $out";
                    fixupPhase = ''
                    chmod 755 $out
                    patchelf --set-interpreter "$(cat $NIX_CC/nix-support/dynamic-linker)" $out
                    '';
                }
            `;
        const origFile = dest + "-orig";
        await fs__default['default'].promises.rename(dest, origFile);
        progress.report({ message: "Patching executable", increment: 20 });
        await new Promise((resolve, reject) => {
            var _a, _b;
            const handle = cp__default['default'].exec(`nix-build -E - --arg src '${origFile}' -o ${dest}`, (err, stdout, stderr) => {
                if (err != null) {
                    reject(Error(stderr));
                }
                else {
                    resolve(stdout);
                }
            });
            (_a = handle.stdin) === null || _a === void 0 ? void 0 : _a.write(expression);
            (_b = handle.stdin) === null || _b === void 0 ? void 0 : _b.end();
        });
        await fs__default['default'].promises.unlink(origFile);
    });
}
async function getServer(config, state) {
    const explicitPath = serverPath(config);
    if (explicitPath) {
        if (explicitPath.startsWith("~/")) {
            return os__default['default'].homedir() + explicitPath.slice("~".length);
        }
        return explicitPath;
    }
    if (config.package.releaseTag === null)
        return "rust-analyzer";
    const platforms = {
        "ia32 win32": "x86_64-pc-windows-msvc",
        "x64 win32": "x86_64-pc-windows-msvc",
        "x64 linux": "x86_64-unknown-linux-gnu",
        "x64 darwin": "x86_64-apple-darwin",
        "arm64 win32": "aarch64-pc-windows-msvc",
        "arm64 darwin": "aarch64-apple-darwin",
    };
    const platform = platforms[`${process.arch} ${process.platform}`];
    if (platform === undefined) {
        vscode__default['default'].window.showErrorMessage("Unfortunately we don't ship binaries for your platform yet. " +
            "You need to manually clone rust-analyzer repository and " +
            "run `cargo xtask install --server` to build the language server from sources. " +
            "If you feel that your platform should be supported, please create an issue " +
            "about that [here](https://github.com/rust-analyzer/rust-analyzer/issues) and we " +
            "will consider it.");
        return undefined;
    }
    const ext = platform.indexOf("-windows-") !== -1 ? ".exe" : "";
    const dest = path__default['default'].join(config.globalStoragePath, `rust-analyzer-${platform}${ext}`);
    const exists = await fs__default['default'].promises.stat(dest).then(() => true, () => false);
    if (!exists) {
        await state.updateServerVersion(undefined);
    }
    if (state.serverVersion === config.package.version)
        return dest;
    if (config.askBeforeDownload) {
        const userResponse = await vscode__default['default'].window.showInformationMessage(`Language server version ${config.package.version} for rust-analyzer is not installed.`, "Download now");
        if (userResponse !== "Download now")
            return dest;
    }
    const releaseTag = config.package.releaseTag;
    const release = await downloadWithRetryDialog(state, async () => {
        return await net.fetchRelease(releaseTag, state.githubToken);
    });
    const artifact = release.assets.find(artifact => artifact.name === `rust-analyzer-${platform}.gz`);
    util.assert(!!artifact, `Bad release: ${JSON.stringify(release)}`);
    await downloadWithRetryDialog(state, async () => {
        await net.download({
            url: artifact.browser_download_url,
            dest,
            progressTitle: "Downloading rust-analyzer server",
            gunzip: true,
            mode: 0o755,
            overwrite: true,
        });
    });
    // Patching executable if that's NixOS.
    if (await isNixOs()) {
        await patchelf(dest);
    }
    await state.updateServerVersion(config.package.version);
    return dest;
}
function serverPath(config) {
    var _a;
    return (_a = process.env.__RA_LSP_SERVER_DEBUG) !== null && _a !== void 0 ? _a : config.serverPath;
}
async function isNixOs() {
    try {
        const contents = await fs__default['default'].promises.readFile("/etc/os-release");
        return contents.indexOf("ID=nixos") !== -1;
    }
    catch (e) {
        return false;
    }
}
async function downloadWithRetryDialog(state, downloadFunc) {
    while (true) {
        try {
            return await downloadFunc();
        }
        catch (e) {
            const selected = await vscode__default['default'].window.showErrorMessage("Failed to download: " + e.message, {}, {
                title: "Update Github Auth Token",
                updateToken: true,
            }, {
                title: "Retry download",
                retry: true,
            }, {
                title: "Dismiss",
            });
            if (selected === null || selected === void 0 ? void 0 : selected.updateToken) {
                await queryForGithubToken(state);
                continue;
            }
            else if (selected === null || selected === void 0 ? void 0 : selected.retry) {
                continue;
            }
            throw e;
        }
    }
}
async function queryForGithubToken(state) {
    const githubTokenOptions = {
        value: state.githubToken,
        password: true,
        prompt: `
            This dialog allows to store a Github authorization token.
            The usage of an authorization token will increase the rate
            limit on the use of Github APIs and can thereby prevent getting
            throttled.
            Auth tokens can be created at https://github.com/settings/tokens`,
    };
    const newToken = await vscode__default['default'].window.showInputBox(githubTokenOptions);
    if (newToken === undefined) {
        // The user aborted the dialog => Do not update the stored token
        return;
    }
    if (newToken === "") {
        util.log.info("Clearing github token");
        await state.updateGithubToken(undefined);
    }
    else {
        util.log.info("Storing new github token");
        await state.updateGithubToken(newToken);
    }
}
function warnAboutExtensionConflicts() {
    const conflicting = [
        ["rust-analyzer", "matklad.rust-analyzer"],
        ["Rust", "rust-lang.rust"],
        ["Rust", "kalitaalexey.vscode-rust"],
    ];
    const found = conflicting.filter(nameId => vscode__default['default'].extensions.getExtension(nameId[1]) !== undefined);
    if (found.length > 1) {
        const fst = found[0];
        const sec = found[1];
        vscode__default['default'].window.showWarningMessage(`You have both the ${fst[0]} (${fst[1]}) and ${sec[0]} (${sec[1]}) ` +
            "plugins enabled. These are known to conflict and cause various functions of " +
            "both plugins to not work correctly. You should disable one of them.", "Got it");
    }
}

});

var main$5 = /*@__PURE__*/getDefaultExportFromCjs(main$4);

module.exports = main$5;
