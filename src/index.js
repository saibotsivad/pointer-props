import { dset } from 'dset'
import dlv from 'dlv'

class InfiniteReference extends Error {
	constructor(props) {
		super(props)
		this.name = 'InfiniteReference'
	}
}

class ExternalReference extends Error {
	constructor(props) {
		super(props)
		this.name = 'ExternalReference'
	}
}

/*

Note on escaping order, from RFC6901:

> Evaluation of each reference token begins by decoding any escaped
> character sequence.  This is performed by first transforming any
> occurrence of the sequence '~1' to '/', and then transforming any
> occurrence of the sequence '~0' to '~'.  By performing the
> substitutions in this order, an implementation avoids the error of
> turning '~01' first into '~1' and then into '/', which would be
> incorrect (the string '~01' correctly becomes '~1' after
> transformation).

*/

/**
 * Convert a JSON Pointer into a list of unescaped tokens, e.g. `/foo/bar~1biz` to `['foo','bar/biz']`.
 * @type {import("../index").toTokens}
 */
export const toTokens = function (path) {
	if (!path.startsWith('/') && !path.startsWith('#/')) throw new ExternalReference(`Non-relative JSON Pointers are not supported: ${path}`)
	;[ , ...path ] = path.split('/')
	let segments = []
	for (let segment of path) {
		segments.push(segment.replaceAll('~1', '/').replaceAll('~0', '~'))
	}
	return segments
}

/**
 * Convert a list of unescaped tokens to a JSON Pointer, e.g. `['foo','bar/biz']` to `/foo/bar~1biz`.
 *  @type {import("../index").toPointer}
 */
export const toPointer = function (list) {
	let output = ''
	for (let segment of list) {
		output += '/' + segment.toString().replaceAll('~', '~0').replaceAll('/', '~1')
	}
	return output
}

/**
 * @param {String|Array<String>} input
 * @returns {Array<String>}
 */
const makeConsistent = input => input.split ? toTokens(input) : input

/**
 * Access a property by JSON Pointer, or by an array of property tokens.
 * @type {import("../index").get}
 */
export const get = function (obj, path) {
	return dlv(obj, makeConsistent(path))
}

/**
 * Set a deep property by JSON Pointer, or by an array of property tokens.
 * @type {import("../index").set}
 */
export function set(obj, path, value) {
	dset(obj, makeConsistent(path), value)
	return obj
}

/**
 * Remove a deep property by JSON Pointer, or by an array of property tokens.
 * @type {import("../index").del}
 */
export function del(obj, path) {
	let segments = makeConsistent(path)
	let last = segments.pop()
	let item = dlv(obj, segments)
	if (Array.isArray(item)) item.splice(parseInt(last, 10), 1)
	else if (item) delete item[last]
	dset(obj, segments, item)
	return obj
}

/**
 * Resolve JSON Reference links to the final absolute array of accessor tokens.
 * @type {import("../index").resolve}
 */
export function resolve(obj, path) {
	const traversed = new Set()
	const _resolve = keys => {
		let actualKeys = []
		let node = obj
		for (let index = 0; index < keys.length; index++) {
			node = obj[keys[index]]
			if (node && node.$ref) {
				if (traversed.has(node.$ref)) throw new InfiniteReference(`Found a cycle of $ref names on: ${node.$ref}`)
				traversed.add(node.$ref)
				actualKeys.push(..._resolve(toTokens(node.$ref)))
				return actualKeys
			} else {
				actualKeys.push(keys[index])
			}
		}
		return actualKeys
	}
	return _resolve(makeConsistent(path))
}
