import { test } from 'uvu'
import * as assert from 'uvu/assert'
import { toTokens, toPointer, get, set, del, resolve } from './index.js'

test('toTokens', () => {
	assert.equal(
		toTokens('/foo/3/bar'),
		[ 'foo', '3', 'bar' ],
		'basic pointers',
	)
	assert.equal(
		toTokens('/f~1o~1o/b~0a~0r'),
		[ 'f/o/o', 'b~a~r' ],
		'escaped characters',
	)
	assert.equal(
		toTokens('/~01'),
		[ '~1' ],
		'order of un-escaping is correct',
	)
	assert.equal(
		toTokens('#/foo/3/bar'),
		[ 'foo', '3', 'bar' ],
		'json reference works as well',
	)
})

test('toPointer', () => {
	assert.equal(
		toPointer([ 'foo', 3, 'bar' ]),
		'/foo/3/bar',
		'basic pointers',
	)
	assert.equal(
		toPointer([ 'f/o/o', 'b~a~r' ]),
		'/f~1o~1o/b~0a~0r',
		'escaping characters',
	)
	assert.equal(
		toPointer([ '~1' ]),
		'/~01',
		'order of un-escaping is correct',
	)
})

test('get', () => {
	assert.equal(
		get({ foo: { bar: 'baz' } }, '/foo/bar'),
		'baz',
		'basic pointer access',
	)
	assert.equal(
		get({ foo: { bar: 'baz' } }, [ 'foo', 'bar' ]),
		'baz',
		'array access is okay',
	)
	assert.equal(
		get({ 'f/o/o': { 'b~a~r': 'baz' } }, '/f~1o~1o/b~0a~0r'),
		'baz',
		'encoded characters',
	)
	assert.equal(
		get({ foo: { bar: 'baz' } }, '#/foo/bar'),
		'baz',
		'json reference works as well',
	)
})

test('set', () => {
	assert.equal(
		set({ foo: { bar: 'baz' } }, '/foo/bar', 'fizz').foo.bar,
		'fizz',
		'basic pointer access',
	)
	assert.equal(
		set({ foo: { bar: 'baz' } }, [ 'foo', 'bar' ], 'fizz').foo.bar,
		'fizz',
		'array access is okay',
	)
	assert.equal(
		set({ 'f/o/o': { 'b~a~r': 'baz' } }, '/f~1o~1o/b~0a~0r', 'fizz')['f/o/o']['b~a~r'],
		'fizz',
		'encoded characters',
	)
})

test('del', () => {
	assert.equal(
		del({ foo: { bar: 'baz' } }, '/foo/bar').foo.bar,
		undefined,
		'basic pointer access',
	)
	assert.equal(
		del({ foo: { bar: 'baz' } }, [ 'foo', 'bar' ]).foo.bar,
		undefined,
		'array access is okay',
	)
	assert.equal(
		del({ 'f/o/o': { 'b~a~r': 'baz' } }, '/f~1o~1o/b~0a~0r')['f/o/o']['b~a~r'],
		undefined,
		'encoded characters',
	)
	assert.equal(
		del({ foo: [ 'a', 'b', 'c' ] }, '/foo/1').foo,
		[ 'a', 'c' ],
		'array by index does not leave holes',
	)
})

test('resolve', () => {
	assert.equal(
		resolve({
			foo: {
				$ref: '#/bar',
			},
			bar: 'baz',
		}, '#/foo'),
		[ 'bar' ],
		'single $ref deep',
	)
	assert.equal(
		resolve({
			foo: {
				$ref: '#/bar'
			},
			bar: 'baz',
		}, [ 'foo' ]),
		[ 'bar' ],
		'single $ref deep with array accessor',
	)
	assert.equal(
		resolve({
			foo: {
				bar: {
					$ref: '#/fizz'
				}
			},
			fizz: {
				buzz: 'should resolve here'
			}
		}, '#/foo/bar/buzz'),
		[ 'fizz', 'buzz' ],
		'deeper $ref chain'
	)
	assert.equal(
		resolve({
			'f/o/o': {
				$ref: '#/b~0a~0r',
			},
			'b~a~r': {
				'b~a/z': 'buzz'
			},
		}, '#/f~1o~1o/b~0a~1z'),
		[ 'b~a~r', 'b~a/z' ],
		'deep access with encoded characters',
	)
	assert.equal(
		resolve({
			'f/o/o': {
				$ref: '#/b~0a~0r',
			},
			'b~a~r': {
				'b~a/z': 'buzz'
			},
		}, [ 'f/o/o', 'b~a/z' ]),
		[ 'b~a~r', 'b~a/z' ],
		'deep access with non-encoded characters is possible with an array',
	)
	assert.equal(
		resolve({
			foo: {
				$ref: '#/bar',
			},
			bar: {
				$ref: '#/fizz',
			},
			fizz: {
				$ref: '#/buzz',
			},
			buzz: {
				somePropertyName: 3,
			},
		}, '#/foo'),
		[ 'buzz' ],
		'long $ref chain',
	)
	assert.throws(
		() => resolve({
			foo: {
				$ref: '#/bar',
			},
			bar: {
				$ref: '#/foo',
			},
		}, [ 'foo' ]),
		err => err.name === 'InfiniteReference',
		'it should detect infinite cycles and throw'
	)
	assert.throws(
		() => resolve({
			foo: {
				$ref: 'https://site.com/#/bar',
			},
		}, [ 'foo' ]),
		err => err.name === 'ExternalReference',
		'external pointers are not supported'
	)
})

test.run()
