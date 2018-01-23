const _ = require('lodash')
const filterObject = requireFrom('helpers/filter-object')

class AccountsRepository {
  constructor (db) {
    this.db = db
  }

  all () {
    return Promise.resolve(this._getLocalAccounts())
  }

  paginate (pager, queryParams = {}) {
    let offset = (pager.page > 1) ? pager.page * pager.perPage : 0

    const accounts = this._getLocalAccounts()

    return Promise.resolve({
      rows: accounts.slice(offset, offset + pager.limit),
      count: accounts.length
    })
  }

  paginateByVote (publicKey, pager) {
    return Promise.resolve(this._getLocalAccounts().filter(a => a.vote === publicKey))
  }

  findById (id) {
    return Promise.resolve(
      this
        ._getLocalAccounts()
        .find(a => (a.address === id || a.publicKey === id || a.username === id))
    )
  }

  findAllByVote (publicKey) {
    return Promise.resolve(this._getLocalAccounts().filter(a => a.vote === publicKey))
  }

  count () {
    return Promise.resolve(this._getLocalAccounts().length)
  }

  top (queryParams) {
    return Promise.resolve(_.sortBy(this._getLocalAccounts(), 'balance').reverse())
  }

  getProducedBlocks (generatorPublicKey) {
    return this.db.blocksTable.count({ where: { generatorPublicKey } })
  }

  search (queryParams) {
    return filterObject(
      this._getLocalAccounts(),
      queryParams,
      {
        exact: ['address', 'publicKey', 'secondPublicKey', 'vote', 'username'],
        between: ['balance', 'votebalance']
      }
    )
  }

  _getLocalAccounts () {
    return Object.values(this.db.localaccounts)
  }
}

module.exports = AccountsRepository