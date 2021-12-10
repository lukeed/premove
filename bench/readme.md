# Benchmarks

> Running on Node 16.13.0

## Load times

Measures the time to `require()` a module.

```
del     28.647ms
rimraf   0.11ms
premove  0.926ms
```

## Performance

Measures the operations per second to remove the target path.

> **Important:** Measurements include the setup operations to prepare a `/fixtures` tree for each operation.

### Async

> The `Promise`-based usage for each candidate.

```
Benchmark :: async :: fixtures/foo-2/hello.txt
  del         x 2,348 ops/sec ±2.32% (92 runs sampled)
  rimraf      x 2,315 ops/sec ±3.49% (88 runs sampled)
  premove     x 2,450 ops/sec ±2.31% (92 runs sampled)

Benchmark :: async :: fixtures/foo-2
  del         x 2,410 ops/sec ±2.55% (91 runs sampled)
  rimraf      x 2,411 ops/sec ±2.17% (93 runs sampled)
  premove     x 2,444 ops/sec ±2.57% (92 runs sampled)

Benchmark :: async :: fixtures/foo-1/bar-3/baz-3/bat-1.txt
  del         x 2,397 ops/sec ±3.26% (92 runs sampled)
  rimraf      x 2,392 ops/sec ±2.77% (91 runs sampled)
  premove     x 2,454 ops/sec ±1.89% (92 runs sampled)

Benchmark :: async :: fixtures/foo-1
  del         x 2,422 ops/sec ±1.92% (92 runs sampled)
  rimraf      x 2,354 ops/sec ±2.46% (91 runs sampled)
  premove     x 2,490 ops/sec ±2.22% (90 runs sampled)
```

### Sync

> The synchronous variant (no Promise)

```
Benchmark :: sync :: fixtures/foo-2/hello.txt
  del         x 2,203 ops/sec ±1.93% (93 runs sampled)
  rimraf      x 2,284 ops/sec ±2.37% (90 runs sampled)
  premove     x 2,427 ops/sec ±3.70% (91 runs sampled)

Benchmark :: sync :: fixtures/foo-2
  del         x 2,169 ops/sec ±2.50% (91 runs sampled)
  rimraf      x 2,286 ops/sec ±2.43% (91 runs sampled)
  premove     x 2,448 ops/sec ±2.27% (92 runs sampled)

Benchmark :: sync :: fixtures/foo-1/bar-3/baz-3/bat-1.txt
  del         x 2,155 ops/sec ±2.54% (91 runs sampled)
  rimraf      x 2,291 ops/sec ±2.24% (94 runs sampled)
  premove     x 2,453 ops/sec ±2.32% (92 runs sampled)

Benchmark :: sync :: fixtures/foo-1
  del         x 2,154 ops/sec ±2.11% (93 runs sampled)
  rimraf      x 2,239 ops/sec ±2.09% (92 runs sampled)
  premove     x 2,395 ops/sec ±2.28% (92 runs sampled)
```
