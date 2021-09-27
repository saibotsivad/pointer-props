import { test } from 'uvu'
import * as assert from 'uvu/assert'
import { toTokens, toPointer, get, set, del } from './index.js'

test('toTokens', () => {
	assert.equal(
		toTokens('/foo/3/bar'),
		[ 'foo', '3', 'bar' ],
		'basic pointers'
	)
	assert.equal(
		toTokens('/f~1o~1o/b~0a~0r'),
		[ 'f/o/o', 'b~a~r' ],
		'escaped characters'
	)
	assert.equal(
		toTokens('/~01'),
		[ '~1' ],
		'order of un-escaping is correct'
	)
})

test('toPointer', () => {
	assert.equal(
		toPointer([ 'foo', 3, 'bar' ]),
		'/foo/3/bar',
		'basic pointers'
	)
	assert.equal(
		toPointer([ 'f/o/o', 'b~a~r' ]),
		'/f~1o~1o/b~0a~0r',
		'escaping characters'
	)
	assert.equal(
		toPointer([ '~1' ]),
		'/~01',
		'order of un-escaping is correct'
	)
})

test('get', () => {
	assert.equal(
		get({ foo: { bar: 'baz' } }, '/foo/bar'),
		'baz',
		'basic pointer access'
	)
	assert.equal(
		get({ foo: { bar: 'baz' } }, [ 'foo', 'bar' ]),
		'baz',
		'array access is okay'
	)
	assert.equal(
		get({ 'f/o/o': { 'b~a~r': 'baz' } }, '/f~1o~1o/b~0a~0r'),
		'baz',
		'encoded characters'
	)
})

test('set', () => {
	assert.equal(
		set({ foo: { bar: 'baz' } }, '/foo/bar', 'fizz').foo.bar,
		'fizz',
		'basic pointer access'
	)
	assert.equal(
		set({ foo: { bar: 'baz' } }, [ 'foo', 'bar' ], 'fizz').foo.bar,
		'fizz',
		'array access is okay'
	)
	assert.equal(
		set({ 'f/o/o': { 'b~a~r': 'baz' } }, '/f~1o~1o/b~0a~0r', 'fizz')['f/o/o']['b~a~r'],
		'fizz',
		'encoded characters'
	)
})

test('del', () => {
	assert.equal(
		del({ foo: { bar: 'baz' } }, '/foo/bar').foo.bar,
		undefined,
		'basic pointer access'
	)
	assert.equal(
		del({ foo: { bar: 'baz' } }, [ 'foo', 'bar' ]).foo.bar,
		undefined,
		'array access is okay'
	)
	assert.equal(
		del({ 'f/o/o': { 'b~a~r': 'baz' } }, '/f~1o~1o/b~0a~0r')['f/o/o']['b~a~r'],
		undefined,
		'encoded characters'
	)
	assert.equal(
		del({ foo: [ 'a', 'b', 'c' ]}, '/foo/1').foo,
		[ 'a', 'c' ],
		'array by index does not leave holes'
	)
})

test.run()
